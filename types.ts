
export enum Phase {
  START = 'START',
  SIMULATION = 'SIMULATION',
  REFLECTION = 'REFLECTION'
}

export enum GamePhase {
  CLOSED_SYSTEM = 1,
  OPEN_SYSTEM = 2,
  PERSISTENT_PATTERNS = 3,
  REPRODUCTION = 4,
  SPECIALIZATION = 5
}

export type UniverseType = 'lifeless' | 'with-life' | 'voracious';

export type PatternType = 'TRI' | 'SQR' | 'PNT';

export type PatternRole = 'HARVESTER' | 'PRODUCER' | 'REPLICATOR' | 'RECYCLER';

export type Language = 'es' | 'en';

export interface Particle {
  id: number;
  x: number;
  y: number;
  state: 'ordered' | 'disordered';
  patternId?: string;
  color?: string;
}

export interface Pattern {
  id: string;
  type: PatternType;
  role?: PatternRole;
  particleIds: number[];
  energyBonus: number;
  slotIndex: number;
  color?: string;
}

export interface PhaseSummary {
  phase: GamePhase;
  maxOrder: number;
  finalEntropy: number;
  rounds: number;
}

export interface HistoryPoint {
  round: number;
  phase: GamePhase;
  order: number;
  localEntropy: number;
  globalEntropy: number;
  energy: number;
  patternsCount: number;
  trianglesCount: number;
  squaresCount: number;
  pentagonsCount: number;
}

export interface CapturedSnapshot {
  id: string;
  timestamp: number;
  universeType: UniverseType;
  history: HistoryPoint[];
  phaseSummaries: PhaseSummary[];
  finalMetrics: {
    totalEntropy: number;
    avgDegradation: number;
    accumulatedOrder: number;
  };
}

export interface AppState {
  currentPhase: Phase;
  gamePhase: GamePhase;
  universeType: UniverseType;
  round: number;
  particles: Particle[];
  patterns: Pattern[];
  energy: number;
  globalEntropy: number;
  history: HistoryPoint[];
  phaseSummaries: PhaseSummary[];
  maxOrderReached: number;
  isAutoMode: boolean;
  isAutoAdvance: boolean;
  language: Language;
  isDarkMode: boolean;
  capturedData: CapturedSnapshot[];
  maxRoundsPerPhase: number;
}
