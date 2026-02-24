
import React, { useMemo } from 'react';
import { Particle, Pattern, GamePhase } from '../types.ts';
import { CONFIG } from '../constants.ts';

interface GameBoardProps {
  particles: Particle[];
  patterns: Pattern[];
  gamePhase: GamePhase;
}

const GameBoard: React.FC<GameBoardProps> = ({ particles, patterns, gamePhase }) => {
  const { cx: bCx, cy: bCy, r: bR } = CONFIG.BIO_WELL;

  // Calculamos la proporción de desorden (Entropía local)
  const disorderRatio = useMemo(() => {
    if (particles.length === 0) return 0;
    const disordered = particles.filter(p => p.state === 'disordered').length;
    return disordered / particles.length;
  }, [particles]);

  // Densidad local: cuántas partículas están físicamente dentro del Nicho de Estabilidad
  const coreDensity = useMemo(() => {
    if (particles.length === 0) return 0;
    const inCore = particles.filter(p => {
      const dist = Math.sqrt(Math.pow(p.x - bCx, 2) + Math.pow(p.y - bCy, 2));
      return dist <= bR;
    }).length;
    // Normalizado respecto a la cantidad inicial esperada en orden
    return Math.min(3, inCore / (CONFIG.PARTICLE_COUNT * 0.4));
  }, [particles, bCx, bCy, bR]);

  // Densidad global (población total)
  const populationFactor = useMemo(() => {
    return Math.min(2.5, particles.length / CONFIG.PARTICLE_COUNT);
  }, [particles.length]);

  const activePatterns = useMemo(() => {
    return patterns.map(pattern => {
      const pts = pattern.particleIds.map(id => particles.find(p => p.id === id)).filter(Boolean) as Particle[];
      return { id: pattern.id, pts, color: pattern.color, type: pattern.type };
    }).filter(p => p.pts.length >= 3);
  }, [patterns, particles]);

  // Lógica de calor específica para fases avanzadas
  const isLatePhase = gamePhase >= GamePhase.PERSISTENT_PATTERNS;
  const heatFactor = disorderRatio * (isLatePhase ? populationFactor * 1.2 : populationFactor);

  // Estilos dinámicos para el fondo térmico (Universo)
  const thermalBackgroundStyle = {
    background: `radial-gradient(circle at 50% 50%, 
      ${heatFactor > 0.4 ? `rgba(${120 + heatFactor * 135}, ${15 + heatFactor * 60}, 15, ${0.12 * heatFactor})` : 'rgba(30, 27, 75, 0.4)'} 0%, 
      ${heatFactor > 0.7 ? `rgba(${70 + heatFactor * 80}, 2, 2, ${Math.min(0.9, 0.4 * heatFactor)})` : 'rgba(2, 6, 23, 0.98)'} 100%)`,
    transition: 'background 0.6s ease-out'
  };

  // Dinámica del Nicho de Baja Entropía
  const coreOpacity = 0.15 + (coreDensity * 0.25);
  const coreGlowSize = 70 + (coreDensity * 15);
  const coreHue = Math.max(180, 230 - (coreDensity * 50)); 
  const coreSaturation = 70 + (coreDensity * 30);

  return (
    <div className="canvas-container shadow-2xl border-4 border-slate-900 relative overflow-hidden bg-slate-950 rounded-[2.5rem]">
      {/* Capa de Calor Dinámico (Baño Térmico) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={thermalBackgroundStyle}
      ></div>

      {/* Efecto de resplandor de calor pulsante */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${heatFactor > 0.5 ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle at center, rgba(251, 146, 60, ${0.08 * heatFactor}) 0%, transparent 80%)`,
          animation: isLatePhase ? 'pulse 2s infinite ease-in-out' : 'pulse 4s infinite ease-in-out'
        }}
      ></div>

      {/* Nicho de Baja Entropía - Zona de Integridad */}
      <div 
        className="absolute rounded-full border-[5px] pointer-events-none transition-all duration-700 z-10"
        style={{
          left: `${bCx}%`,
          top: `${bCy}%`,
          width: `${bR * 2}%`,
          height: `${bR * 2}%`,
          transform: 'translate(-50%, -50%)',
          borderColor: `hsla(${coreHue}, ${coreSaturation}%, 60%, 0.8)`,
          boxShadow: `0 0 ${20 + coreDensity * 40}px hsla(${coreHue}, 100%, 50%, ${0.2 * coreDensity})`,
          background: `radial-gradient(circle, hsla(${coreHue}, 100%, 70%, ${coreOpacity}) 0%, transparent ${coreGlowSize}%)`,
          backdropFilter: `blur(${1 + coreDensity}px)`
        }}
      >
        {gamePhase === GamePhase.REPRODUCTION && (
          <div 
            className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"
            style={{ animationDuration: '3s' }}
          ></div>
        )}
      </div>

      {/* Capa de Enlaces Estructurales (SVG) */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {activePatterns.map((pattern) => {
          const baseColor = pattern.color || (pattern.type === 'TRI' ? '#f59e0b' : pattern.type === 'SQR' ? '#10b981' : '#8b5cf6');
          const points = pattern.pts.map(p => `${p.x},${p.y}`).join(' ');
          
          return (
            <g key={pattern.id}>
              {pattern.pts.map((pt, i) => {
                const nextPt = pattern.pts[(i + 1) % pattern.pts.length];
                return (
                  <line 
                    key={`${pattern.id}-l-${i}`}
                    x1={pt.x} y1={pt.y} x2={nextPt.x} y2={nextPt.y} 
                    stroke={baseColor} 
                    strokeWidth={pattern.type === 'PNT' ? "1.8" : "1.4"} 
                    filter="url(#glow)" 
                    className="opacity-90" 
                  />
                );
              })}
              <polygon
                points={points}
                fill={baseColor}
                fillOpacity={pattern.type === 'PNT' ? "0.25" : "0.15"}
                className="animate-pulse"
              />
            </g>
          );
        })}
      </svg>

      {/* Capa de Partículas Físicas */}
      <div className="absolute inset-0 z-30">
        {particles.map((p) => {
          const isPattern = !!p.patternId;
          const parentPattern = isPattern ? patterns.find(pat => pat.id === p.patternId) : null;
          const mutationColor = p.color || (parentPattern?.type === 'TRI' ? '#f59e0b' : parentPattern?.type === 'SQR' ? '#10b981' : parentPattern?.type === 'PNT' ? '#8b5cf6' : undefined);
          
          const isDisordered = p.state === 'disordered';
          
          // Lógica de color de la partícula
          let particleBg = '#94a3b8'; // Gris por defecto (Partículas no usadas / neutras)
          let particleBorder = '#f1f5f9';
          let shadow = 'none';

          if (isPattern) {
            particleBg = mutationColor!;
            particleBorder = 'white';
            shadow = `0 0 12px ${mutationColor}`;
          } else if (isDisordered) {
            // Partícula caótica (no usada y desordenada) -> Color térmico
            particleBg = `rgba(${190 + heatFactor * 65}, ${110 - heatFactor * 90}, ${40}, 0.95)`;
            particleBorder = 'rgba(255,255,255,0.4)';
          } else {
            // Partícula "ordenada" pero no usada (Gris frío)
            particleBg = '#475569';
            particleBorder = '#cbd5e1';
          }
          
          return (
            <div
              key={p.id}
              className={`absolute rounded-full transition-all duration-500 ease-out border
                ${p.state === 'ordered' 
                  ? 'w-2 h-2 z-30 border-2' 
                  : 'w-2 h-2 z-20 shadow-[0_0_4px_rgba(0,0,0,0.5)]'}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translate(-50%, -50%) scale(${p.state === 'ordered' ? 1.15 : 1})`,
                backgroundColor: particleBg,
                borderColor: particleBorder,
                boxShadow: shadow,
              }}
            >
              {isPattern && (
                <div 
                  className="absolute inset-0 bg-current opacity-30 rounded-full animate-ping pointer-events-none"
                  style={{ color: mutationColor }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
