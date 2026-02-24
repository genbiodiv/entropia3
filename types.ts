
export enum Phase {
  START = 'START',
  SIMULATION = 'SIMULATION',
  REFLECTION = 'REFLECTION'
}

export enum GamePhase {
  CLOSED_SYSTEM = 1,
  OPEN_SYSTEM = 2,
  PERSISTENT_PATTERNS = 3,
  REPRODUCTION = 4
}

export type UniverseType = 'with-life' | 'lifeless';

export type PatternType = 'TRI' | 'SQR' | 'PNT';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

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
  order: number;
  localEntropy: number;
  globalEntropy: number;
  phase: GamePhase;
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
  language: Language;
  theme: Theme;
}
