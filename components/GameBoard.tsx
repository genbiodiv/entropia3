
import React, { useMemo } from 'react';
import { Particle, Pattern, GamePhase } from '../types.ts';
import { CONFIG, PHASE_THEMES } from '../constants.ts';
import { Zap, Magnet, Copy, RefreshCw } from 'lucide-react';

interface GameBoardProps {
  particles: Particle[];
  patterns: Pattern[];
  gamePhase: GamePhase;
  isDarkMode: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ particles, patterns, gamePhase, isDarkMode }) => {
  const { cx: bCx, cy: bCy, r: bR } = CONFIG.BIO_WELL;
  const theme = PHASE_THEMES[gamePhase as keyof typeof PHASE_THEMES] || PHASE_THEMES[1];

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
      return { id: pattern.id, pts, color: pattern.color, type: pattern.type, role: pattern.role };
    }).filter(p => p.pts.length >= 3);
  }, [patterns, particles]);

  // Lógica de calor específica para fases avanzadas
  const isLatePhase = gamePhase >= GamePhase.PERSISTENT_PATTERNS;
  const heatFactor = disorderRatio * (isLatePhase ? populationFactor * 1.2 : populationFactor);

  // Estilos dinámicos para el fondo térmico (Universo)
  const thermalBackgroundStyle = {
    background: isDarkMode 
      ? `radial-gradient(circle at 50% 50%, 
          ${heatFactor > 0.4 ? `rgba(${120 + heatFactor * 135}, ${15 + heatFactor * 60}, 15, ${0.12 * heatFactor})` : 'rgba(30, 27, 75, 0.4)'} 0%, 
          ${heatFactor > 0.7 ? `rgba(${70 + heatFactor * 80}, 2, 2, ${Math.min(0.9, 0.4 * heatFactor)})` : 'rgba(2, 6, 23, 0.98)'} 100%)`
      : `radial-gradient(circle at 50% 50%, 
          rgba(255, 255, 255, 0) 0%, 
          ${heatFactor > 0.5 ? `rgba(255, 192, 203, 0.2)` : 'rgba(255, 251, 235, 0.1)'} 100%)`,
    transition: 'background 0.6s ease-out'
  };

  // Dinámica del Nicho de Baja Entropía
  const coreOpacity = 0.15 + (coreDensity * 0.25);
  const coreGlowSize = 70 + (coreDensity * 15);
  const coreHue = Math.max(180, 230 - (coreDensity * 50)); 
  const coreSaturation = 70 + (coreDensity * 30);

  return (
    <div 
      className={`canvas-container shadow-2xl border-4 relative overflow-hidden rounded-[2.5rem] transition-colors duration-1000 ${isDarkMode ? 'border-slate-900 bg-slate-950' : 'border-amber-300 bg-amber-50'}`}
      style={!isDarkMode ? { backgroundColor: '#fffbeb' } : {}}
    >
      {/* Capa de Calor Dinámico (Baño Térmico) */}
      {isDarkMode && (
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={thermalBackgroundStyle}
        ></div>
      )}

      {/* Efecto de resplandor de calor pulsante */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${heatFactor > 0.5 ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle at center, rgba(251, 146, 60, ${isDarkMode ? 0.08 : 0.12} * ${heatFactor}) 0%, transparent 80%)`,
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
          borderColor: isDarkMode ? (theme.border || `hsla(${coreHue}, ${coreSaturation}%, 60%, 0.8)`) : `hsla(${coreHue}, 80%, 70%, 0.9)`,
          boxShadow: isDarkMode 
            ? `0 0 ${20 + coreDensity * 40}px hsla(${coreHue}, 100%, 50%, ${0.2 * coreDensity})`
            : `0 0 ${15 + coreDensity * 30}px hsla(${coreHue}, 100%, 60%, ${0.15 * coreDensity})`,
          background: isDarkMode ? theme.cell : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: `blur(${2 + coreDensity}px)`
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
        className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible"
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
          
          const centerX = pattern.pts.reduce((acc, p) => acc + p.x, 0) / pattern.pts.length;
          const centerY = pattern.pts.reduce((acc, p) => acc + p.y, 0) / pattern.pts.length;

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

      {/* Capa de Iconos de Rol (HTML para evitar deformación por SVG stretching) */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {activePatterns.map((pattern) => {
          if (!pattern.role) return null;
          const centerX = pattern.pts.reduce((acc, p) => acc + p.x, 0) / pattern.pts.length;
          const centerY = pattern.pts.reduce((acc, p) => acc + p.y, 0) / pattern.pts.length;
          
          return (
            <div 
              key={`role-${pattern.id}`}
              className="absolute flex items-center justify-center text-white/90 drop-shadow-md"
              style={{
                left: `${centerX}%`,
                top: `${centerY}%`,
                width: '1.2rem',
                height: '1.2rem',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {pattern.role === 'HARVESTER' && <Magnet className="w-full h-full" />}
              {pattern.role === 'PRODUCER' && <Zap className="w-full h-full" />}
              {pattern.role === 'REPLICATOR' && <Copy className="w-full h-full" />}
              {pattern.role === 'RECYCLER' && <RefreshCw className="w-full h-full" />}
            </div>
          );
        })}
      </div>

      {/* Capa de Partículas Físicas */}
      <div className="absolute inset-0 z-30">
        {particles.map((p) => {
          const isPattern = !!p.patternId;
          const parentPattern = isPattern ? patterns.find(pat => pat.id === p.patternId) : null;
          const mutationColor = p.color || (parentPattern?.type === 'TRI' ? '#f59e0b' : parentPattern?.type === 'SQR' ? '#10b981' : parentPattern?.type === 'PNT' ? '#8b5cf6' : undefined);
          
          const isDisordered = p.state === 'disordered';
          
          // Lógica de color de la partícula
          let particleBg = isDarkMode ? '#94a3b8' : '#f59e0b'; // Ámbar brillante en modo claro
          let particleBorder = isDarkMode ? '#f1f5f9' : '#ffffff';
          let shadow = 'none';

          if (isPattern) {
            particleBg = mutationColor!;
            particleBorder = isDarkMode ? 'white' : '#000000';
            shadow = isDarkMode ? `0 0 12px ${mutationColor}` : `0 0 12px ${mutationColor}`;
          } else if (isDisordered) {
            // Partícula caótica (no usada y desordenada) -> Color térmico
            particleBg = isDarkMode 
              ? `rgba(190, 110, 40, 0.95)`
              : `rgba(255, 0, 100, 1)`; // Rosa neón puro
            particleBorder = isDarkMode ? 'rgba(255,255,255,0.4)' : '#ffffff';
          } else {
            // Partícula "ordenada" pero no usada
            particleBg = isDarkMode ? '#475569' : '#fbbf24'; // Amarillo brillante
            particleBorder = isDarkMode ? '#cbd5e1' : '#ffffff';
          }
          
          const isPhase5 = gamePhase === GamePhase.SPECIALIZATION;
          const size = isDarkMode 
            ? (isPhase5 ? 'w-1.5 h-1.5' : 'w-2 h-2') 
            : (isPhase5 ? 'w-2.5 h-2.5' : 'w-3 h-3');
          
          return (
            <div
              key={p.id}
              className={`absolute rounded-full transition-all duration-500 ease-out border
                ${p.state === 'ordered' 
                  ? `${size} z-30 border-2` 
                  : `${size} z-20 shadow-[0_0_4px_rgba(0,0,0,0.3)]`}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translate(-50%, -50%) scale(${p.state === 'ordered' ? 1.2 : 1})`,
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
