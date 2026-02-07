/**
 * Core type definitions for the MagmaLab engine
 */

/** Major oxide composition in wt% */
export interface Composition {
  SiO2: number;
  TiO2: number;
  Al2O3: number;
  FeOt: number; // Total iron as FeO
  MnO: number;
  MgO: number;
  CaO: number;
  Na2O: number;
  K2O: number;
  P2O5: number;
}

/** Volatile content in wt% */
export interface Volatiles {
  H2O: number;
  CO2?: number; // Optional for MVP
}

/** A point on a P-T-t path: [time in seconds, value] */
export type PathPoint = [number, number];

/** Pressure-Temperature-time path definition */
export interface PTPath {
  /** End time in seconds */
  t_end_s: number;
  /** Temperature points: [[time_s, temp_C], ...] */
  T_points: PathPoint[];
  /** Pressure points: [[time_s, pressure_MPa], ...] */
  P_points: PathPoint[];
}

/** Emplacement environment */
export type Emplacement = 'extrusive' | 'intrusive';

/** System type for degassing */
export type SystemType = 'open' | 'closed';

/** Environment settings */
export interface Environment {
  emplacement: Emplacement;
  system: SystemType;
}

/** Complete scenario definition */
export interface Scenario {
  version: string;
  composition: Composition;
  volatiles: Volatiles;
  path: PTPath;
  environment: Environment;
}

/** TAS classification result */
export interface TASResult {
  /** Volcanic rock name from TAS diagram */
  volcanicName: string;
  /** Intrusive equivalent name */
  intrusiveName: string;
  /** SiO2 value used */
  sio2: number;
  /** Total alkalis (Na2O + K2O) used */
  totalAlkalis: number;
  /** Distance to nearest field boundary (for confidence) */
  boundaryDistance: number;
  /** TAS field code */
  fieldCode: string;
}

/** Mineral category */
export type MineralCategory = 'primary' | 'secondary' | 'accessory';

/** Mineral inference result */
export interface MineralResult {
  name: string;
  category: MineralCategory;
  likelihood: 'likely' | 'possible' | 'unlikely';
  explanation: string;
}

/** Texture classification */
export type TextureType =
  | 'glassy'
  | 'aphanitic'
  | 'phaneritic'
  | 'porphyritic'
  | 'vesicular';

/** Texture inference result */
export interface TextureResult {
  texture: TextureType;
  description: string;
  explanation: string;
  glassFraction: number; // 0-1 estimate
}

/** Timeline event */
export interface TimelineEvent {
  order: number;
  timeDescription: string;
  event: string;
  details: string;
}

/** Confidence level */
export type ConfidenceLevel = 'low' | 'medium' | 'high';

/** Confidence assessment */
export interface ConfidenceResult {
  level: ConfidenceLevel;
  score: number; // 0-1
  factors: string[];
}

/** Complete prediction result */
export interface PredictionResult {
  tas: TASResult;
  minerals: MineralResult[];
  texture: TextureResult;
  timeline: TimelineEvent[];
  confidence: ConfidenceResult;
}

/** Saved scenario with metadata */
export interface SavedScenario {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  scenario: Scenario;
}

/** Preset composition */
export interface CompositionPreset {
  id: string;
  name: string;
  description: string;
  composition: Composition;
  volatiles: Volatiles;
}

/** Preset path */
export interface PathPreset {
  id: string;
  name: string;
  description: string;
  path: PTPath;
  environment: Environment;
}
