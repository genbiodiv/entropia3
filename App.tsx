
import React, { useState, useCallback, useEffect } from 'react';
import { Phase, GamePhase, AppState, Particle, HistoryPoint, Pattern, PhaseSummary, UniverseType, PatternType, Language } from './types.ts';
import { CONFIG, TRANSLATIONS, PHASE_COLORS } from './constants.ts';
import GameBoard from './components/GameBoard.tsx';
import Sidebar from './components/Sidebar.tsx';
import Splash from './components/Splash.tsx';
import ReflectionScreen from './components/ReflectionScreen.tsx';

declare const marked: any;

const getRandomInCircle = (cx: number, cy: number, r: number) => {
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.sqrt(Math.random()) * r;
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist
  };
};

const generateInitialParticles = (): Particle[] => {
  const particles: Particle[] = [];
  const { cx, cy, r } = CONFIG.BIO_WELL;
  
  for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
    const isOrdered = i < CONFIG.PARTICLE_COUNT * 0.4;
    const pos = isOrdered 
      ? getRandomInCircle(cx, cy, r)
      : { x: Math.random() * 100, y: Math.random() * 100 };
      
    particles.push({
      id: i,
      state: isOrdered ? 'ordered' : 'disordered',
      x: pos.x,
      y: pos.y,
    });
  }
  return particles;
};

const getInitialState = (lang: Language = 'es'): AppState => ({
  currentPhase: Phase.START,
  gamePhase: GamePhase.CLOSED_SYSTEM,
  universeType: 'with-life',
  round: 1,
  particles: generateInitialParticles(),
  patterns: [],
  energy: 0,
  globalEntropy: 0,
  history: [],
  phaseSummaries: [],
  maxOrderReached: 0,
  isAutoMode: false,
  language: lang
});

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getInitialState());
  const [showReadme, setShowReadme] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');

  useEffect(() => {
    fetch('README.md')
      .then(res => res.text())
      .then(text => setReadmeContent(text))
      .catch(err => console.error("Error loading README:", err));
  }, []);

  const resetGame = useCallback(() => {
    setState(getInitialState(state.language));
  }, [state.language]);

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'es' ? 'en' : 'es' }));
  };

  const startGame = (type: UniverseType) => {
    setState(prev => ({
      ...prev,
      universeType: type,
      currentPhase: Phase.SIMULATION
    }));
  };

  const clamp = (val: number) => Math.min(Math.max(val, 2), 98);

  const getNextFreeSlot = (currentPatterns: Pattern[]) => {
    const maxSlots = CONFIG.GRID_COLS * CONFIG.GRID_ROWS;
    const occupied = new Set(currentPatterns.map(p => p.slotIndex));
    for (let i = 0; i < maxSlots; i++) {
      if (!occupied.has(i)) return i;
    }
    return -1;
  };

  const getSlotCoords = (slotIndex: number) => {
    const { cx, cy, r } = CONFIG.BIO_WELL;
    const gridR = r * 0.8; 
    const col = slotIndex % CONFIG.GRID_COLS;
    const row = Math.floor(slotIndex / CONFIG.GRID_COLS);
    
    const startX = cx - gridR;
    const startY = cy - gridR;
    const stepX = (gridR * 2) / (CONFIG.GRID_COLS - 1 || 1);
    const stepY = (gridR * 2) / (CONFIG.GRID_ROWS - 1 || 1);
    
    return { 
      cx: startX + col * stepX, 
      cy: startY + row * stepY 
    };
  };

  const repairOrder = useCallback(() => {
    if (state.universeType === 'lifeless') return;
    setState(prev => {
      if (prev.energy < CONFIG.REPAIR_COST) return prev;
      let count = 0;
      const { cx: bCx, cy: bCy, r: bR } = CONFIG.BIO_WELL;
      
      const newParticles = prev.particles.map(p => {
        if (p.state === 'disordered' && count < CONFIG.REPAIR_EFFECT) {
          count++;
          const pos = getRandomInCircle(bCx, bCy, bR);
          return { ...p, state: 'ordered' as const, x: pos.x, y: pos.y };
        }
        return p;
      });
      return { ...prev, energy: prev.energy - CONFIG.REPAIR_COST, globalEntropy: prev.globalEntropy + 10, particles: newParticles };
    });
  }, [state.universeType]);

  const organizeParticles = useCallback(() => {
    if (state.universeType === 'lifeless') return;
    setState(prev => {
      if (prev.energy < CONFIG.ORGANIZE_COST) return prev;
      const looseOrdered = prev.particles.filter(p => p.state === 'ordered' && !p.patternId);
      if (looseOrdered.length < 3) return prev;

      const slotIndex = getNextFreeSlot(prev.patterns);
      if (slotIndex === -1) return prev;

      const { cx, cy } = getSlotCoords(slotIndex);
      const r = CONFIG.TRI_RADIUS;
      const targets = [{ x: cx, y: cy - r }, { x: cx - r * 0.86, y: cy + r * 0.5 }, { x: cx + r * 0.86, y: cy + r * 0.5 }];

      const patternId = `p-${Date.now()}-${Math.random()}`;
      const group = looseOrdered.slice(0, 3);
      const newParticles = prev.particles.map(p => {
        const idx = group.findIndex(g => g.id === p.id);
        if (idx !== -1) return { ...p, x: targets[idx].x, y: targets[idx].y, patternId };
        return p;
      });

      return { 
        ...prev, 
        energy: prev.energy - CONFIG.ORGANIZE_COST, 
        globalEntropy: prev.globalEntropy + 25, 
        particles: newParticles, 
        patterns: [...prev.patterns, { 
          id: patternId, 
          type: 'TRI',
          particleIds: group.map(g => g.id), 
          energyBonus: CONFIG.PATTERN_BONUS_ENERGY, 
          slotIndex 
        }] 
      };
    });
  }, [state.universeType]);

  const evolvePattern = useCallback(() => {
    if (state.universeType === 'lifeless' || state.gamePhase < GamePhase.REPRODUCTION) return;
    setState(prev => {
      if (prev.energy < CONFIG.EVOLVE_COST) return prev;
      
      const patternToEvolve = prev.patterns.find(p => p.type !== 'PNT');
      if (!patternToEvolve) return prev;

      const looseOrdered = prev.particles.filter(p => p.state === 'ordered' && !p.patternId);
      if (looseOrdered.length === 0) return prev;

      const newType: PatternType = patternToEvolve.type === 'TRI' ? 'SQR' : 'PNT';
      const extraParticle = looseOrdered[0];
      const allParticleIds = [...patternToEvolve.particleIds, extraParticle.id];

      const { cx, cy } = getSlotCoords(patternToEvolve.slotIndex);
      const r = CONFIG.TRI_RADIUS * 1.2;
      const numPts = allParticleIds.length;
      const targets = Array.from({ length: numPts }).map((_, i) => ({
        x: cx + Math.cos((i * 2 * Math.PI / numPts) - Math.PI / 2) * r,
        y: cy + Math.sin((i * 2 * Math.PI / numPts) - Math.PI / 2) * r
      }));

      const newParticles = prev.particles.map(p => {
        const idx = allParticleIds.indexOf(p.id);
        if (idx !== -1) return { ...p, x: targets[idx].x, y: targets[idx].y, patternId: patternToEvolve.id };
        return p;
      });

      const newPatterns = prev.patterns.map(p => {
        if (p.id === patternToEvolve.id) {
          return { 
            ...p, 
            type: newType, 
            particleIds: allParticleIds, 
            energyBonus: p.energyBonus * 2.2 
          };
        }
        return p;
      });

      return {
        ...prev,
        energy: prev.energy - CONFIG.EVOLVE_COST,
        globalEntropy: prev.globalEntropy + 150,
        particles: newParticles,
        patterns: newPatterns
      };
    });
  }, [state.universeType, state.gamePhase]);

  const getCopyCost = (gameState: AppState) => {
    if (gameState.gamePhase !== GamePhase.REPRODUCTION) return CONFIG.COPY_COST;
    const reduction = gameState.patterns.length * 0.12;
    return Math.max(0.4, CONFIG.PHASE4_COPY_COST_BASE - reduction);
  };

  const reproducePattern = useCallback(() => {
    if (state.universeType === 'lifeless') return;
    setState(prev => {
      const cost = getCopyCost(prev);
      if (prev.energy < cost) return prev;
      
      const slotIndex = getNextFreeSlot(prev.patterns);
      if (slotIndex === -1) return prev;

      const { cx, cy } = getSlotCoords(slotIndex);
      const r = CONFIG.TRI_RADIUS;
      const targets = [{ x: cx, y: cy - r }, { x: cx - r * 0.86, y: cy + r * 0.5 }, { x: cx + r * 0.86, y: cy + r * 0.5 }];

      const isPhase4 = prev.gamePhase === GamePhase.REPRODUCTION;
      const mutationColor = isPhase4 && Math.random() < CONFIG.MUTATION_RATE 
        ? PHASE_COLORS[Math.floor(Math.random() * PHASE_COLORS.length)] 
        : undefined;

      const patternId = `p-rep-${Date.now()}-${Math.random()}`;
      const newParts: Particle[] = [];
      let success = true;
      for (let i = 0; i < 3; i++) {
        const isError = Math.random() < (isPhase4 ? 0.04 : CONFIG.COPY_ERROR_RATE);
        if (isError) success = false;
        newParts.push({ 
          id: Date.now() + i + Math.random(), 
          state: isError ? 'disordered' : 'ordered', 
          patternId: (!isError && success) ? patternId : undefined, 
          x: isError ? Math.random() * 100 : targets[i].x, 
          y: isError ? Math.random() * 100 : targets[i].y,
          color: mutationColor
        });
      }

      const entropyImpact = isPhase4 ? 110 : 40;

      return { 
        ...prev, 
        energy: prev.energy - cost, 
        globalEntropy: prev.globalEntropy + entropyImpact, 
        particles: [...prev.particles, ...newParts], 
        patterns: success ? [...prev.patterns, { 
          id: patternId, 
          type: 'TRI',
          particleIds: newParts.map(p => p.id), 
          energyBonus: isPhase4 ? CONFIG.PHASE4_ENERGY_BONUS : CONFIG.PATTERN_BONUS_ENERGY, 
          slotIndex,
          color: mutationColor
        }] : prev.patterns 
      };
    });
  }, [state.universeType]);

  const advanceRound = useCallback(() => {
    setState(prev => {
      if (prev.round >= CONFIG.MAX_ROUNDS_PER_PHASE) return prev;

      let nextParticles = prev.particles.map(p => {
        const isPattern = !!p.patternId;
        const intensity = isPattern ? CONFIG.STRUCTURE_VIBRATION : (p.state === 'ordered' ? CONFIG.DRIFT_INTENSITY : CONFIG.WANDER_INTENSITY);
        const nx = clamp(p.x + (Math.random() - 0.5) * intensity);
        const ny = clamp(p.y + (Math.random() - 0.5) * intensity);
        
        let newState = p.state;
        let newPatternId = p.patternId;
        if (p.state === 'ordered' && Math.random() < CONFIG.NOISE_RATE) {
          newState = 'disordered';
          newPatternId = undefined;
        }
        return { ...p, x: nx, y: ny, state: newState, patternId: newPatternId };
      });

      let validPatterns = prev.patterns.filter(pattern => {
        const isIntact = pattern.particleIds.every(id => {
          const p = nextParticles.find(part => part.id === id);
          return p && p.state === 'ordered' && p.patternId === pattern.id;
        });
        if (!isIntact) {
          nextParticles = nextParticles.map(p => 
            pattern.particleIds.includes(p.id) ? { ...p, patternId: undefined } : p
          );
        }
        return isIntact;
      });

      if (prev.gamePhase === GamePhase.REPRODUCTION && prev.universeType === 'with-life') {
        validPatterns.forEach(pattern => {
          const { cx, cy } = getSlotCoords(pattern.slotIndex);
          let converted = 0;
          nextParticles = nextParticles.map(p => {
            if (p.state === 'disordered' && converted < CONFIG.PHASE4_CONVERSION_LIMIT) {
              const dist = Math.sqrt(Math.pow(p.x - cx, 2) + Math.pow(p.y - cy, 2));
              if (dist < CONFIG.PHASE4_ATTRACTION_RADIUS) {
                converted++;
                return { 
                  ...p, 
                  state: 'ordered', 
                  x: clamp(cx + (Math.random() - 0.5) * 5), 
                  y: clamp(cy + (Math.random() - 0.5) * 5),
                  color: pattern.color
                };
              }
            }
            return p;
          });
        });
      }

      const orderedCount = nextParticles.filter(p => p.state === 'ordered').length;
      const currentLocalEntropy = 1 - (orderedCount / nextParticles.length);
      const isPhase4 = prev.gamePhase === GamePhase.REPRODUCTION;
      
      const totalPatternDissipation = validPatterns.reduce((acc, p) => {
        const complexityData = CONFIG.COMPLEXITY[p.type];
        const base = complexityData ? complexityData.dissipation : 15;
        return acc + (isPhase4 ? base * 2.5 : base);
      }, 0);

      const entropyGenerated = (nextParticles.length - orderedCount) + totalPatternDissipation;
      const newGlobalEntropy = prev.globalEntropy + entropyGenerated;

      const historyPoint: HistoryPoint = {
        round: prev.round,
        order: orderedCount,
        localEntropy: currentLocalEntropy,
        globalEntropy: newGlobalEntropy,
        phase: prev.gamePhase
      };

      const totalEnergyGain = validPatterns.reduce((acc, p) => {
        const multiplier = CONFIG.COMPLEXITY[p.type]?.bonus || 1;
        const baseBonus = isPhase4 ? CONFIG.PHASE4_ENERGY_BONUS : CONFIG.PATTERN_BONUS_ENERGY;
        return acc + (baseBonus * multiplier);
      }, (prev.gamePhase >= GamePhase.OPEN_SYSTEM ? CONFIG.ENERGY_PER_ROUND : 0));

      const finalEnergyGain = prev.universeType === 'lifeless' ? 0 : totalEnergyGain;

      return {
        ...prev,
        round: prev.round + 1,
        particles: nextParticles,
        patterns: validPatterns,
        energy: prev.energy + finalEnergyGain,
        globalEntropy: newGlobalEntropy,
        maxOrderReached: Math.max(prev.maxOrderReached, orderedCount),
        history: [...prev.history, historyPoint]
      };
    });
  }, []);

  const handlePhaseTransition = () => {
    setState(prev => {
      const energyEntropy = prev.energy * 25;
      const finalPhaseEntropy = prev.globalEntropy + energyEntropy;

      const summary: PhaseSummary = {
        phase: prev.gamePhase,
        maxOrder: prev.maxOrderReached,
        finalEntropy: finalPhaseEntropy,
        rounds: prev.round
      };

      const nextPhaseSummaries = [...prev.phaseSummaries, summary];

      if (prev.gamePhase === GamePhase.REPRODUCTION) {
        return { ...prev, globalEntropy: finalPhaseEntropy, phaseSummaries: nextPhaseSummaries, currentPhase: Phase.REFLECTION };
      } else {
        return { 
          ...prev, 
          globalEntropy: finalPhaseEntropy,
          phaseSummaries: nextPhaseSummaries,
          gamePhase: (prev.gamePhase + 1) as GamePhase, 
          round: 1, 
          energy: 0, 
          maxOrderReached: 0,
          patterns: [],
          particles: generateInitialParticles()
        };
      }
    });
  };

  useEffect(() => {
    if (state.isAutoMode && state.currentPhase === Phase.SIMULATION && state.universeType === 'with-life') {
      const isPhase4 = state.gamePhase === GamePhase.REPRODUCTION;
      const timer = setTimeout(() => {
        const cost = getCopyCost(state);
        
        const canEvolve = state.gamePhase >= GamePhase.REPRODUCTION && state.energy >= CONFIG.EVOLVE_COST && state.patterns.some(p => p.type !== 'PNT') && state.particles.some(p => p.state === 'ordered' && !p.patternId);
        
        if (canEvolve) {
          evolvePattern();
        }
        else if (state.gamePhase >= GamePhase.REPRODUCTION && state.energy >= cost && getNextFreeSlot(state.patterns) !== -1) {
          reproducePattern();
        } 
        else if (state.gamePhase >= GamePhase.PERSISTENT_PATTERNS && state.energy >= CONFIG.ORGANIZE_COST && getNextFreeSlot(state.patterns) !== -1) {
          if (state.particles.filter(p => p.state === 'ordered' && !p.patternId).length >= 3) organizeParticles();
          else if (state.energy >= CONFIG.REPAIR_COST) repairOrder();
        }
        else if (state.gamePhase >= GamePhase.OPEN_SYSTEM && state.energy >= CONFIG.REPAIR_COST && state.particles.some(p => p.state === 'disordered')) {
          repairOrder();
        }
      }, isPhase4 ? 100 : 350);
      return () => clearTimeout(timer);
    }
  }, [state.round, state.energy, state.isAutoMode, state.gamePhase, state.universeType]);

  const canAdvance = state.round >= CONFIG.MIN_ROUNDS_TO_ADVANCE;
  const t = TRANSLATIONS[state.language];
  const phaseInfo = t.phases[state.gamePhase];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 select-none">
      {state.currentPhase === Phase.START && (
        <Splash 
          state={state}
          onStart={startGame} 
          onOpenDocs={() => setShowReadme(true)}
          onToggleLanguage={toggleLanguage}
        />
      )}
      
      {state.currentPhase === Phase.SIMULATION && (
        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
          <div className="flex-1 flex flex-col gap-4">
            <header className="flex justify-between items-start bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-xl ${state.universeType === 'lifeless' ? 'bg-slate-500' : 'bg-indigo-600'}`}>{state.gamePhase}</div>
                <div>
                  <h1 className="text-2xl font-black text-slate-800 uppercase leading-none tracking-tight">{phaseInfo.title}</h1>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {t.cycle} {state.round} {t.of} {CONFIG.MAX_ROUNDS_PER_PHASE} • {state.universeType === 'lifeless' ? t.lifelessUniverse : t.withLifeUniverse}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-4">
                   <div className="text-right border-r border-slate-100 pr-4">
                    <p className="text-[10px] uppercase text-slate-400 font-black mb-1">{t.localOrder}</p>
                    <p className="text-3xl font-mono text-indigo-600 font-black leading-none">
                      {Math.round((state.particles.filter(p => p.state === 'ordered').length / state.particles.length) * 100)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-slate-500 font-black mb-1">{t.globalEntropy}</p>
                    <p className="text-4xl font-mono text-red-600 font-black leading-none animate-pulse">{state.globalEntropy.toFixed(0)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={toggleLanguage}
                    className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[9px] font-black uppercase hover:bg-slate-200 transition-colors"
                  >
                    {state.language === 'es' ? 'English' : 'Español'}
                  </button>
                  {state.universeType === 'with-life' && (
                    <button 
                      onClick={() => setState(p => ({...p, isAutoMode: !p.isAutoMode}))}
                      className={`flex items-center gap-2 px-4 py-1 rounded-full font-black text-[9px] transition-all border-2 shadow-sm uppercase ${state.isAutoMode ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${state.isAutoMode ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`}></div>
                      {t.autoMode} {state.isAutoMode ? 'ON' : 'OFF'}
                    </button>
                  )}
                </div>
              </div>
            </header>
            
            <GameBoard particles={state.particles} patterns={state.patterns} gamePhase={state.gamePhase} />

            <div className="bg-white p-3 rounded-3xl shadow-xl border border-slate-200 flex flex-wrap gap-3 items-center">
              <button 
                onClick={advanceRound} 
                disabled={state.round >= CONFIG.MAX_ROUNDS_PER_PHASE} 
                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-black transition-all disabled:opacity-20 flex items-center gap-2 shadow-lg active:scale-95 text-base"
              >
                {t.runCycle}
              </button>

              <div className="h-10 w-px bg-slate-100 mx-1" />

              {state.universeType === 'with-life' && !state.isAutoMode && (
                <div className="flex gap-2">
                  {state.gamePhase >= GamePhase.OPEN_SYSTEM && (
                    <button onClick={repairOrder} disabled={state.energy < CONFIG.REPAIR_COST} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-black transition-all disabled:opacity-20 shadow-md text-xs">
                      {t.collect} (⚡{CONFIG.REPAIR_COST})
                    </button>
                  )}

                  {state.gamePhase >= GamePhase.PERSISTENT_PATTERNS && (
                    <button onClick={organizeParticles} disabled={state.energy < CONFIG.ORGANIZE_COST} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-black transition-all disabled:opacity-20 shadow-md text-xs">
                      {t.structure} (⚡{CONFIG.ORGANIZE_COST})
                    </button>
                  )}

                  {state.gamePhase >= GamePhase.REPRODUCTION && (
                    <>
                      <button 
                        onClick={reproducePattern} 
                        disabled={state.energy < getCopyCost(state)} 
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl font-black transition-all disabled:opacity-20 shadow-md text-xs"
                      >
                        {t.clone} (⚡{getCopyCost(state).toFixed(1)})
                      </button>
                      <button 
                        onClick={evolvePattern} 
                        disabled={state.energy < CONFIG.EVOLVE_COST || !state.patterns.some(p => p.type !== 'PNT') || !state.particles.some(p => p.state === 'ordered' && !p.patternId)} 
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-black transition-all disabled:opacity-20 shadow-md text-xs"
                      >
                        {t.mutate} (⚡{CONFIG.EVOLVE_COST})
                      </button>
                    </>
                  )}
                </div>
              )}

              {state.universeType === 'with-life' && state.isAutoMode && (
                <div className="px-6 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-black text-xs animate-pulse flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeWidth="2" strokeLinecap="round"/></svg>
                  {t.autoStrategy}
                </div>
              )}

              {state.universeType === 'lifeless' && (
                <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 font-black text-xs flex items-center gap-2">
                  {t.noAgents}
                </div>
              )}

              <div className="ml-auto bg-slate-50 border-2 border-slate-200 rounded-xl px-6 py-3 flex flex-col items-end">
                <span className="text-[9px] text-slate-400 font-black uppercase mb-0.5 tracking-widest">{t.energyFlow}</span>
                <span className="text-3xl font-black text-amber-600 leading-none">⚡ {state.energy.toFixed(1)}</span>
              </div>

              {canAdvance && (
                <button 
                  onClick={handlePhaseTransition}
                  className="bg-red-600 text-white px-8 py-3 rounded-xl font-black ml-2 hover:bg-red-700 transition-all shadow-xl animate-pulse active:scale-95 text-base"
                >
                  {state.gamePhase === GamePhase.REPRODUCTION ? t.results : t.nextPhase}
                </button>
              )}
            </div>
          </div>
          <Sidebar state={state} onOpenDocs={() => setShowReadme(true)} />
        </div>
      )}

      {state.currentPhase === Phase.REFLECTION && <ReflectionScreen state={state} onRestart={resetGame} />}

      {showReadme && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReadme(false)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-full overflow-hidden">
            <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[2.5rem]">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t.guideTitle}
              </h2>
              <button 
                onClick={() => setShowReadme(false)}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l18 18" /></svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 md:p-12 prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: marked.parse(readmeContent || (state.language === 'es' ? 'Cargando guía...' : 'Loading guide...')) }} />
            </div>
            <footer className="px-8 py-6 border-t border-slate-100 text-center">
              <button 
                onClick={() => setShowReadme(false)}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-colors"
              >
                {t.understand}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
