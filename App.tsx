
import React, { useState, useCallback, useEffect } from 'react';
import { Phase, GamePhase, AppState, Particle, HistoryPoint, Pattern, PhaseSummary, UniverseType, PatternType, Language, CapturedSnapshot } from './types.ts';
import { CONFIG, TRANSLATIONS, PHASE_COLORS } from './constants.ts';
import GameBoard from './components/GameBoard.tsx';
import Sidebar from './components/Sidebar.tsx';
import Splash from './components/Splash.tsx';
import ReflectionScreen from './components/ReflectionScreen.tsx';

import { Flame, Zap, Box, Copy, RefreshCw, ChevronRight, BarChart3, Sun, Moon, Languages } from 'lucide-react';

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
  isAutoAdvance: false,
  language: lang,
  isDarkMode: true,
  capturedData: []
});

const formatValue = (val: number) => {
  if (val >= 1000) {
    const k = val / 1000;
    if (k >= 100) return Math.floor(k).toString().slice(0, 3) + 'K';
    if (k >= 10) return k.toFixed(1).slice(0, 4) + 'K';
    return k.toFixed(2).slice(0, 4) + 'K';
  }
  if (val >= 100) return Math.floor(val).toString().slice(0, 4);
  return val.toFixed(1).slice(0, 4);
};

const clamp = (val: number) => Math.min(Math.max(val, 2), 98);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getInitialState());
  const [showReadme, setShowReadme] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');
  const [celebration, setCelebration] = useState<string | null>(null);
  const [reachedMilestones, setReachedMilestones] = useState<number[]>([]);

  const isPhaseComplete = state.round >= CONFIG.MAX_ROUNDS_PER_PHASE;
  const t = TRANSLATIONS[state.language];
  const phaseInfo = t.phases[state.gamePhase];

  const milestones = [500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

  useEffect(() => {
    const currentEntropy = state.globalEntropy;
    const nextMilestone = milestones.find(m => currentEntropy >= m && !reachedMilestones.includes(m));
    
    if (nextMilestone) {
      setCelebration(`¡Hito de Entropía: ${nextMilestone}!`);
      setReachedMilestones(prev => [...prev, nextMilestone]);
      setTimeout(() => setCelebration(null), 3000);
    }

    const orderedCount = state.particles.filter(p => p.state === 'ordered').length;
    const localOrderPercent = (orderedCount / state.particles.length) * 100;
    if (localOrderPercent >= 100 && !reachedMilestones.includes(999)) { // 999 as code for 100% order
      setCelebration("¡ORDEN LOCAL AL 100%!");
      setReachedMilestones(prev => [...prev, 999]);
      setTimeout(() => setCelebration(null), 3000);
    }
  }, [state.globalEntropy, state.particles, reachedMilestones]);

  const resetGame = useCallback(() => {
    setState(getInitialState(state.language));
  }, [state.language]);

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'es' ? 'en' : 'es' }));
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const captureSnapshot = () => {
    setState(prev => {
      if (prev.capturedData.length > 0) return prev;
      const snapshot: CapturedSnapshot = {
        id: `sim_${Date.now()}`,
        timestamp: Date.now(),
        universeType: prev.universeType,
        history: [...prev.history],
        phaseSummaries: [...prev.phaseSummaries],
        finalMetrics: {
          totalEntropy: prev.globalEntropy,
          avgDegradation: prev.history.reduce((acc, h) => acc + h.localEntropy, 0) / (prev.history.length || 1),
          accumulatedOrder: prev.history.reduce((acc, h) => acc + h.order, 0)
        }
      };
      return { ...prev, capturedData: [...prev.capturedData, snapshot] };
    });
  };

  const downloadCSV = () => {
    if (state.capturedData.length === 0) return;
    const headers = [
      "Simulation_ID", 
      "Timestamp", 
      "Universe", 
      "Phase", 
      "Round", 
      "Local_Order", 
      "Local_Entropy", 
      "Global_Entropy", 
      "Energy", 
      "Patterns_Total", 
      "Triangles", 
      "Squares", 
      "Pentagons"
    ];
    
    const rows: any[] = [];
    
    state.capturedData.forEach(sim => {
      sim.history.forEach(h => {
        rows.push([
          sim.id,
          new Date(sim.timestamp).toISOString(),
          sim.universeType,
          h.phase,
          h.round,
          h.order.toFixed(2),
          h.localEntropy.toFixed(4),
          h.globalEntropy.toFixed(2),
          h.energy.toFixed(2),
          h.patternsCount,
          h.trianglesCount,
          h.squaresCount,
          h.pentagonsCount
        ]);
      });
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `entropy_full_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startGame = (type: UniverseType) => {
    setState(prev => ({
      ...prev,
      universeType: type,
      isAutoMode: type === 'voracious',
      currentPhase: Phase.SIMULATION
    }));
  };

  const getNextFreeSlot = (currentPatterns: Pattern[], phase: GamePhase) => {
    const maxSlots = phase === GamePhase.SPECIALIZATION ? CONFIG.PHASE5_MAX_PATTERNS : CONFIG.GRID_COLS * CONFIG.GRID_ROWS;
    const occupied = new Set(currentPatterns.map(p => p.slotIndex));
    
    if (phase === GamePhase.SPECIALIZATION) {
      // Interleaved order: Harvester (0-15), Producer (16-23), Recycler (24-31), Replicator (32-39)
      // We take one from each group in cycles of 4
      const order: number[] = [];
      for (let i = 0; i < 8; i++) {
        order.push(i, 16 + i, 24 + i, 32 + i);
      }
      // Add remaining Harvesters (8-15)
      for (let i = 8; i < 16; i++) {
        order.push(i);
      }
      
      for (const slot of order) {
        if (!occupied.has(slot)) return slot;
      }
    } else {
      for (let i = 0; i < maxSlots; i++) {
        if (!occupied.has(i)) return i;
      }
    }
    return -1;
  };

  const getSlotCoords = (slotIndex: number, phase: GamePhase) => {
    const { cx, cy, r } = CONFIG.BIO_WELL;
    
    if (phase === GamePhase.SPECIALIZATION) {
      if (slotIndex < 16) { // Periphery: Harvesters
        const angle = (slotIndex / 16) * Math.PI * 2;
        const dist = r * 0.9;
        return { cx: cx + Math.cos(angle) * dist, cy: cy + Math.sin(angle) * dist };
      } else if (slotIndex < 32) { // Intermediate: Producers & Recyclers
        const angle = ((slotIndex - 16) / 16) * Math.PI * 2;
        const dist = r * 0.55;
        return { cx: cx + Math.cos(angle) * dist, cy: cy + Math.sin(angle) * dist };
      } else { // Center: Replicators
        const angle = ((slotIndex - 32) / 8) * Math.PI * 2;
        const dist = r * 0.25;
        return { cx: cx + Math.cos(angle) * dist, cy: cy + Math.sin(angle) * dist };
      }
    }

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

  const getRoleForSlot = (slotIndex: number) => {
    if (slotIndex < 16) return 'HARVESTER' as const;
    if (slotIndex < 24) return 'PRODUCER' as const;
    if (slotIndex < 32) return 'RECYCLER' as const;
    return 'REPLICATOR' as const;
  };

  const getRoleColor = (role?: string) => {
    if (!role) return undefined;
    return TRANSLATIONS.es.roleColors[role as keyof typeof TRANSLATIONS.es.roleColors];
  };

  const getRepairCost = (gameState: AppState) => {
    const recyclers = gameState.patterns.filter(p => p.role === 'RECYCLER').length;
    const synergy = gameState.gamePhase === GamePhase.SPECIALIZATION ? 1 / (1 + recyclers * 0.8) : 1;
    return Math.max(0.05, CONFIG.REPAIR_COST * synergy);
  };

  const getOrganizeCost = (gameState: AppState) => {
    const harvesters = gameState.patterns.filter(p => p.role === 'HARVESTER').length;
    const synergy = gameState.gamePhase === GamePhase.SPECIALIZATION ? 1 / (1 + harvesters * 0.5) : 1;
    return Math.max(0.2, CONFIG.ORGANIZE_COST * synergy);
  };

  const getEvolveCost = (gameState: AppState) => {
    const producers = gameState.patterns.filter(p => p.role === 'PRODUCER').length;
    const synergy = gameState.gamePhase === GamePhase.SPECIALIZATION ? 1 / (1 + producers * 0.6) : 1;
    return Math.max(0.5, CONFIG.EVOLVE_COST * synergy);
  };

  const getCopyCost = (gameState: AppState) => {
    const replicators = gameState.patterns.filter(p => p.role === 'REPLICATOR').length;
    const baseCost = gameState.gamePhase === GamePhase.REPRODUCTION ? CONFIG.PHASE4_COPY_COST_BASE : CONFIG.COPY_COST;
    const reduction = gameState.patterns.length * 0.12;
    const synergy = gameState.gamePhase === GamePhase.SPECIALIZATION ? 1 / (1 + replicators * 1.2) : 1;
    return Math.max(0.05, (baseCost - reduction) * synergy);
  };

  const repairOrder = useCallback(() => {
    if (state.universeType === 'lifeless') return;
    setState(prev => {
      const actualCost = getRepairCost(prev);
      
      if (prev.energy < actualCost) return prev;
      let count = 0;
      const { cx: bCx, cy: bCy, r: bR } = CONFIG.BIO_WELL;
      
      const repairEffect = CONFIG.REPAIR_EFFECT + (prev.patterns.filter(p => p.role === 'RECYCLER').length * 2);
      
      const newParticles = prev.particles.map(p => {
        if (p.state === 'disordered' && count < repairEffect) {
          count++;
          const pos = getRandomInCircle(bCx, bCy, bR);
          return { ...p, state: 'ordered' as const, x: pos.x, y: pos.y };
        }
        return p;
      });
      return { ...prev, energy: prev.energy - actualCost, globalEntropy: prev.globalEntropy + 10, particles: newParticles };
    });
  }, [state.universeType]);

  const organizeParticles = useCallback(() => {
    if (state.universeType === 'lifeless') return;
    setState(prev => {
      const cost = getOrganizeCost(prev);
      if (prev.energy < cost) return prev;
      const looseOrdered = prev.particles.filter(p => p.state === 'ordered' && !p.patternId);
      if (looseOrdered.length < 3) return prev;

      const slotIndex = getNextFreeSlot(prev.patterns, prev.gamePhase);
      if (slotIndex === -1) return prev;

      const { cx, cy } = getSlotCoords(slotIndex, prev.gamePhase);
      const r = prev.gamePhase === GamePhase.SPECIALIZATION ? CONFIG.TRI_RADIUS * CONFIG.PHASE5_RADIUS_SCALE : CONFIG.TRI_RADIUS;
      const targets = [{ x: cx, y: cy - r }, { x: cx - r * 0.86, y: cy + r * 0.5 }, { x: cx + r * 0.86, y: cy + r * 0.5 }];

      const patternId = `p-${Date.now()}-${Math.random()}`;
      const isPhase5 = prev.gamePhase === GamePhase.SPECIALIZATION;
      const role = isPhase5 ? getRoleForSlot(slotIndex) : undefined;
      const roleColor = isPhase5 ? getRoleColor(role) : undefined;
      
      const group = looseOrdered.slice(0, 3);
      const newParticles = prev.particles.map(p => {
        const idx = group.findIndex(g => g.id === p.id);
        if (idx !== -1) return { ...p, x: targets[idx].x, y: targets[idx].y, patternId, color: roleColor };
        return p;
      });

      return { 
        ...prev, 
        energy: prev.energy - cost, 
        globalEntropy: prev.globalEntropy + 25, 
        particles: newParticles, 
        patterns: [...prev.patterns, { 
          id: patternId, 
          type: 'TRI',
          role,
          particleIds: group.map(g => g.id), 
          energyBonus: isPhase5 ? CONFIG.PHASE4_ENERGY_BONUS : CONFIG.PATTERN_BONUS_ENERGY, 
          slotIndex,
          color: roleColor
        }] 
      };
    });
  }, [state.universeType]);

  const evolvePattern = useCallback(() => {
    if (state.universeType === 'lifeless' || state.gamePhase < GamePhase.REPRODUCTION) return;
    setState(prev => {
      const cost = getEvolveCost(prev);
      if (prev.energy < cost) return prev;
      
      const patternToEvolve = prev.patterns.find(p => p.type !== 'PNT');
      if (!patternToEvolve) return prev;

      const looseOrdered = prev.particles.filter(p => p.state === 'ordered' && !p.patternId);
      if (looseOrdered.length === 0) return prev;

      const newType: PatternType = patternToEvolve.type === 'TRI' ? 'SQR' : 'PNT';
      const extraParticle = looseOrdered[0];
      const allParticleIds = [...patternToEvolve.particleIds, extraParticle.id];

      const { cx, cy } = getSlotCoords(patternToEvolve.slotIndex, prev.gamePhase);
      const r = (prev.gamePhase === GamePhase.SPECIALIZATION ? CONFIG.TRI_RADIUS * CONFIG.PHASE5_RADIUS_SCALE : CONFIG.TRI_RADIUS) * 1.2;
      const numPts = allParticleIds.length;
      const targets = Array.from({ length: numPts }).map((_, i) => ({
        x: cx + Math.cos((i * 2 * Math.PI / numPts) - Math.PI / 2) * r,
        y: cy + Math.sin((i * 2 * Math.PI / numPts) - Math.PI / 2) * r
      }));

      const newParticles = prev.particles.map(p => {
        const idx = allParticleIds.indexOf(p.id);
        if (idx !== -1) return { ...p, x: targets[idx].x, y: targets[idx].y, patternId: patternToEvolve.id, color: patternToEvolve.color };
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
        energy: prev.energy - cost,
        globalEntropy: prev.globalEntropy + 150,
        particles: newParticles,
        patterns: newPatterns
      };
    });
  }, [state.universeType, state.gamePhase]);

  const reproducePattern = useCallback(() => {
    if (state.universeType === 'lifeless') return;
    setState(prev => {
      const cost = getCopyCost(prev);
      if (prev.energy < cost) return prev;
      
      const slotIndex = getNextFreeSlot(prev.patterns, prev.gamePhase);
      if (slotIndex === -1) return prev;

      const { cx, cy } = getSlotCoords(slotIndex, prev.gamePhase);
      const r = prev.gamePhase === GamePhase.SPECIALIZATION ? CONFIG.TRI_RADIUS * CONFIG.PHASE5_RADIUS_SCALE : CONFIG.TRI_RADIUS;
      const targets = [{ x: cx, y: cy - r }, { x: cx - r * 0.86, y: cy + r * 0.5 }, { x: cx + r * 0.86, y: cy + r * 0.5 }];

      const isPhase4 = prev.gamePhase === GamePhase.REPRODUCTION;
      const isPhase5 = prev.gamePhase === GamePhase.SPECIALIZATION;
      
      const patternId = `p-rep-${Date.now()}-${Math.random()}`;
      const role = isPhase5 ? getRoleForSlot(slotIndex) : undefined;
      const roleColor = isPhase5 ? getRoleColor(role) : undefined;
      
      const mutationColor = (isPhase4 && !isPhase5) && Math.random() < CONFIG.MUTATION_RATE 
        ? PHASE_COLORS[Math.floor(Math.random() * PHASE_COLORS.length)] 
        : roleColor;

      const newParts: Particle[] = [];
      let success = true;
      for (let i = 0; i < 3; i++) {
        const isError = Math.random() < (isPhase4 || isPhase5 ? 0.04 : CONFIG.COPY_ERROR_RATE);
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

      const entropyImpact = isPhase4 || isPhase5 ? 110 : 40;

      return { 
        ...prev, 
        energy: prev.energy - cost, 
        globalEntropy: prev.globalEntropy + entropyImpact, 
        particles: [...prev.particles, ...newParts], 
        patterns: success ? [...prev.patterns, { 
          id: patternId, 
          type: 'TRI',
          role,
          particleIds: newParts.map(p => p.id), 
          energyBonus: isPhase4 || isPhase5 ? CONFIG.PHASE4_ENERGY_BONUS : CONFIG.PATTERN_BONUS_ENERGY, 
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

      if (prev.gamePhase >= GamePhase.REPRODUCTION && prev.universeType === 'with-life') {
        validPatterns.forEach(pattern => {
          const { cx, cy } = getSlotCoords(pattern.slotIndex, prev.gamePhase);
          let converted = 0;
          const harvesterBonus = pattern.role === 'HARVESTER' ? 4 : 1;
          const attractionRadius = pattern.role === 'HARVESTER' ? CONFIG.PHASE4_ATTRACTION_RADIUS * 2.0 : CONFIG.PHASE4_ATTRACTION_RADIUS;
          
          nextParticles = nextParticles.map(p => {
            if (p.state === 'disordered' && converted < CONFIG.PHASE4_CONVERSION_LIMIT * harvesterBonus) {
              const dist = Math.sqrt(Math.pow(p.x - cx, 2) + Math.pow(p.y - cy, 2));
              if (dist < attractionRadius) {
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
      const isPhase5 = prev.gamePhase === GamePhase.SPECIALIZATION;
      
      const totalPatternDissipation = validPatterns.reduce((acc, p) => {
        const complexityData = CONFIG.COMPLEXITY[p.type];
        const base = complexityData ? complexityData.dissipation : 15;
        return acc + (isPhase4 || isPhase5 ? base * 2.5 : base);
      }, 0);

      const entropyGenerated = (nextParticles.length - orderedCount) + totalPatternDissipation;
      const newGlobalEntropy = prev.globalEntropy + entropyGenerated;

      const historyPoint: HistoryPoint = {
        round: prev.round,
        phase: prev.gamePhase,
        order: orderedCount,
        localEntropy: currentLocalEntropy,
        globalEntropy: newGlobalEntropy,
        energy: prev.energy,
        patternsCount: validPatterns.length,
        trianglesCount: validPatterns.filter(p => p.type === 'TRI').length,
        squaresCount: validPatterns.filter(p => p.type === 'SQR').length,
        pentagonsCount: validPatterns.filter(p => p.type === 'PNT').length
      };

      const totalEnergyGain = validPatterns.reduce((acc, p) => {
        const multiplier = CONFIG.COMPLEXITY[p.type]?.bonus || 1;
        const producerBonus = p.role === 'PRODUCER' ? 2 : 1;
        const baseBonus = isPhase4 || isPhase5 ? CONFIG.PHASE4_ENERGY_BONUS : CONFIG.PATTERN_BONUS_ENERGY;
        return acc + (baseBonus * multiplier * producerBonus);
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

      if (prev.gamePhase === GamePhase.SPECIALIZATION) {
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

  // --- Effects ---

  useEffect(() => {
    fetch('README.md')
      .then(res => res.text())
      .then(text => setReadmeContent(text))
      .catch(err => console.error("Error loading README:", err));
  }, []);

  // Auto-Advance Logic
  useEffect(() => {
    let interval: any;
    if (state.currentPhase === Phase.SIMULATION && state.isAutoAdvance && !isPhaseComplete) {
      interval = setInterval(() => {
        // Only advance if no actions are possible
        const canRepair = state.energy >= getRepairCost(state) && state.particles.some(p => p.state === 'disordered');
        const canOrganize = state.energy >= getOrganizeCost(state) && getNextFreeSlot(state.patterns, state.gamePhase) !== -1 && state.particles.filter(p => p.state === 'ordered' && !p.patternId).length >= 3;
        const canCopy = state.energy >= getCopyCost(state) && getNextFreeSlot(state.patterns, state.gamePhase) !== -1;
        const canEvolve = state.energy >= getEvolveCost(state) && state.patterns.some(p => p.type !== 'PNT') && state.particles.some(p => p.state === 'ordered' && !p.patternId);
        
        const canDoAnything = state.universeType !== 'lifeless' && (canRepair || canOrganize || canCopy || canEvolve);
        
        if (!canDoAnything) {
          advanceRound();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.currentPhase, state.isAutoAdvance, isPhaseComplete, advanceRound, state.energy, state.particles, state.patterns, state.gamePhase, state.universeType]);

  // Voracious Mode Enforcement
  useEffect(() => {
    if (state.universeType === 'voracious' && !state.isAutoMode) {
      setState(prev => ({ ...prev, isAutoMode: true }));
    }
  }, [state.universeType, state.isAutoMode]);

  useEffect(() => {
    if (state.isAutoMode && state.currentPhase === Phase.SIMULATION && state.universeType === 'voracious') {
      const isPhase4 = state.gamePhase === GamePhase.REPRODUCTION;
      const isPhase5 = state.gamePhase === GamePhase.SPECIALIZATION;
      const isPhase3 = state.gamePhase === GamePhase.PERSISTENT_PATTERNS;
      
      const timer = setTimeout(() => {
        const copyCost = getCopyCost(state);
        const evolveCost = getEvolveCost(state);
        const organizeCost = getOrganizeCost(state);
        const repairCost = getRepairCost(state);

        // Voracious Strategy: Accumulate energy in the first 5 rounds of each level
        if (state.round <= 5 && state.energy < 25) {
          if (state.energy >= repairCost * 2 && state.particles.some(p => p.state === 'disordered')) {
            repairOrder();
          }
          return;
        }

        const isLateCycle = state.round >= 14;
        const hasExcessEnergy = state.energy >= 35;
        const favorComplexity = hasExcessEnergy || isLateCycle;
        
        // Voracious Strategy: Accumulate energy early but maintain basic order
        if (isPhase3 && state.energy < 15 && state.round < 10) {
          if (state.energy >= repairCost * 3 && state.particles.some(p => p.state === 'disordered')) {
            repairOrder();
          }
          return;
        }
        if ((isPhase4 || isPhase5) && state.energy < 20 && state.round < 8) {
          if (state.energy >= repairCost * 3 && state.particles.some(p => p.state === 'disordered')) {
            repairOrder();
          }
          return;
        }

        // 1. Complexity Strategy (Evolve) - Higher priority if energy is high or late cycle
        if (favorComplexity) {
          const canEvolve = state.gamePhase >= GamePhase.REPRODUCTION && state.energy >= evolveCost && state.patterns.some(p => p.type !== 'PNT') && state.particles.some(p => p.state === 'ordered' && !p.patternId);
          if (canEvolve) {
            evolvePattern();
            return;
          }
        }

        // 2. Expansion Strategy (Reproduce/Organize)
        if (state.gamePhase >= GamePhase.REPRODUCTION && state.energy >= copyCost && getNextFreeSlot(state.patterns, state.gamePhase) !== -1) {
          reproducePattern();
          return;
        }

        if (state.gamePhase >= GamePhase.PERSISTENT_PATTERNS && state.energy >= organizeCost && getNextFreeSlot(state.patterns, state.gamePhase) !== -1) {
          if (state.particles.filter(p => p.state === 'ordered' && !p.patternId).length >= 3) {
            organizeParticles();
            return;
          }
        }

        // 3. Fallback Complexity (Evolve) - If we didn't favor it but have nothing else to do and can afford it
        if (!favorComplexity) {
          const canEvolve = state.gamePhase >= GamePhase.REPRODUCTION && state.energy >= evolveCost && state.patterns.some(p => p.type !== 'PNT') && state.particles.some(p => p.state === 'ordered' && !p.patternId);
          if (canEvolve) {
            evolvePattern();
            return;
          }
        }

        // 4. Maintenance (Repair)
        if (state.gamePhase >= GamePhase.OPEN_SYSTEM && state.energy >= repairCost && state.particles.some(p => p.state === 'disordered')) {
          repairOrder();
          return;
        }
      }, isPhase4 || isPhase5 ? 150 : 400);
      return () => clearTimeout(timer);
    }
  }, [state.round, state.energy, state.isAutoMode, state.gamePhase, state.universeType, evolvePattern, reproducePattern, organizeParticles, repairOrder]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 select-none ${state.isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`p-4 md:p-6 border-b flex justify-between items-center sticky top-0 z-50 backdrop-blur-md ${state.isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h1 className="text-xl font-black uppercase tracking-tighter leading-none">{t.title}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {t.phases[state.gamePhase].title} • {t.cycle} {state.round}/{CONFIG.MAX_ROUNDS_PER_PHASE}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 justify-end">
          <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-2 ${state.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex flex-col items-end w-[55px]">
              <span className="text-[8px] font-black text-red-500 uppercase leading-none mb-1">{t.globalEntropy}</span>
              <span className={`text-sm font-black tabular-nums leading-none ${state.isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{formatValue(state.globalEntropy)}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
              <Flame className="w-3 h-3 text-red-500 fill-current" />
            </div>
          </div>

          <div className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-2 ${state.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex flex-col items-end w-[55px]">
              <span className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Energía</span>
              <span className="text-sm font-black text-indigo-500 leading-none">{formatValue(state.energy)}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-3 h-3 text-indigo-500 fill-current" />
            </div>
          </div>

          <div className="flex gap-1.5 ml-2">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition-all ${state.isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-500'}`}
            >
              {state.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleLanguage}
              className={`p-2 rounded-xl border transition-all flex items-center gap-2 ${state.isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-500'}`}
            >
              <Languages className="w-5 h-5" />
              <span className="text-xs font-bold uppercase">{state.language}</span>
            </button>
          </div>
        </div>
      </header>

      {celebration && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          <div className="bg-indigo-600 text-white px-12 py-6 rounded-[2rem] shadow-2xl animate-bounce border-4 border-white/20 backdrop-blur-md">
            <h2 className="text-3xl font-black uppercase tracking-tighter">{celebration}</h2>
          </div>
        </div>
      )}

      {state.currentPhase === Phase.START && (
        <Splash 
          state={state}
          onStart={startGame} 
          onOpenDocs={() => setShowReadme(true)}
          onToggleLanguage={toggleLanguage}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {state.currentPhase === Phase.SIMULATION && (
        <div className="flex-1 flex flex-col p-4 md:p-8 gap-4 md:gap-8 overflow-hidden max-w-[1800px] mx-auto w-full relative">
          <div className="flex-1 flex flex-col gap-4 md:gap-8">
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-full h-full max-w-5xl mx-auto flex items-center justify-center">
                <GameBoard particles={state.particles} patterns={state.patterns} gamePhase={state.gamePhase} />
              </div>
            </div>
            
            <div className={`p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] shadow-xl border flex flex-wrap items-center justify-center gap-3 md:gap-6 ${state.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3">
                {!isPhaseComplete ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={advanceRound} 
                      className={`h-12 px-5 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 text-xs whitespace-nowrap ${state.isDarkMode ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-white'}`}
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t.runCycle} (L{state.gamePhase} • {state.round}/{CONFIG.MAX_ROUNDS_PER_PHASE})
                    </button>

                    {(state.universeType === 'lifeless' || state.universeType === 'voracious') && (
                      <button 
                        onClick={() => setState(p => ({ ...p, isAutoAdvance: !p.isAutoAdvance }))}
                        className={`h-12 px-5 rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 text-xs whitespace-nowrap border-2 ${state.isAutoAdvance ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                      >
                        <RefreshCw className={`w-4 h-4 ${state.isAutoAdvance ? 'animate-spin' : ''}`} />
                        {t.autoAdvance}
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={handlePhaseTransition}
                    className="h-12 px-6 bg-red-600 text-white rounded-xl font-black hover:bg-red-700 transition-all shadow-xl animate-pulse active:scale-95 text-xs flex items-center gap-2 whitespace-nowrap"
                  >
                    {state.gamePhase === GamePhase.REPRODUCTION ? t.results : t.nextPhase}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {state.universeType === 'with-life' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-3xl">
                  <div className="h-12">
                    {state.gamePhase >= GamePhase.OPEN_SYSTEM && (
                      <button onClick={repairOrder} disabled={state.energy < CONFIG.REPAIR_COST} className="w-full h-full group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-2 rounded-xl font-black transition-all disabled:opacity-20 shadow-md text-[10px] sm:text-xs whitespace-nowrap">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-bounce" />
                        {t.collect} (⚡{CONFIG.REPAIR_COST})
                      </button>
                    )}
                  </div>

                  <div className="h-12">
                    {state.gamePhase >= GamePhase.PERSISTENT_PATTERNS && (
                      <button onClick={organizeParticles} disabled={state.energy < CONFIG.ORGANIZE_COST} className="w-full h-full group flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-2 rounded-xl font-black transition-all disabled:opacity-20 shadow-md text-[10px] sm:text-xs whitespace-nowrap">
                        <Box className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12" />
                        {t.structure} (⚡{CONFIG.ORGANIZE_COST})
                      </button>
                    )}
                  </div>

                  <div className="h-12">
                    {state.gamePhase >= GamePhase.REPRODUCTION && (
                      <button 
                        onClick={reproducePattern} 
                        disabled={state.energy < getCopyCost(state)} 
                        className="w-full h-full group flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-2 rounded-xl font-black transition-all disabled:opacity-20 shadow-md text-[10px] sm:text-xs whitespace-nowrap"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110" />
                        {t.clone} (⚡{getCopyCost(state).toFixed(1)})
                      </button>
                    )}
                  </div>

                  <div className="h-12">
                    {state.gamePhase >= GamePhase.REPRODUCTION && (
                      <button 
                        onClick={evolvePattern} 
                        disabled={state.energy < CONFIG.EVOLVE_COST || !state.patterns.some(p => p.type !== 'PNT') || !state.particles.some(p => p.state === 'ordered' && !p.patternId)} 
                        className="w-full h-full group flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-2 rounded-xl font-black transition-all disabled:opacity-20 shadow-md text-[10px] sm:text-xs whitespace-nowrap"
                      >
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500" />
                        {t.mutate} (⚡{CONFIG.EVOLVE_COST})
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button 
                onClick={resetGame}
                className={`h-12 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 text-[10px] uppercase tracking-widest ${state.isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <RefreshCw className="w-3 h-3" />
                Reiniciar
              </button>
            </div>
          </div>
          <Sidebar state={state} onOpenDocs={() => setShowReadme(true)} />
        </div>
      )}

      {state.currentPhase === Phase.REFLECTION && (
        <ReflectionScreen 
          state={state} 
          onRestart={resetGame} 
          onDownloadCSV={downloadCSV}
          onCaptureSnapshot={captureSnapshot}
        />
      )}

      {showReadme && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReadme(false)}></div>
          <div className={`relative w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-full overflow-hidden border transition-colors duration-500 ${state.isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <header className={`px-8 py-6 border-b flex justify-between items-center rounded-t-[2.5rem] ${state.isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <h2 className={`text-xl font-black uppercase tracking-tight flex items-center gap-3 ${state.isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t.guideTitle}
              </h2>
              <button 
                onClick={() => setShowReadme(false)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${state.isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l18 18" /></svg>
              </button>
            </header>
            <div className={`flex-1 overflow-y-auto p-8 md:p-12 prose max-w-none ${state.isDarkMode ? 'prose-invert' : ''}`}>
              <div dangerouslySetInnerHTML={{ __html: marked.parse(readmeContent || (state.language === 'es' ? 'Cargando guía...' : 'Loading guide...')) }} />
            </div>
            <footer className={`px-8 py-6 border-t ${state.isDarkMode ? 'border-slate-800' : 'border-slate-100'} text-center`}>
              <button 
                onClick={() => setShowReadme(false)}
                className={`px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-colors ${state.isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-black'}`}
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
