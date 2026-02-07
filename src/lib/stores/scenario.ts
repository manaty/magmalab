import { writable, derived } from 'svelte/store';
import type {
  Scenario,
  Composition,
  Volatiles,
  PTPath,
  Environment,
  PredictionResult
} from '$lib/engine/types';

/** Default composition (MORB-like) */
const defaultComposition: Composition = {
  SiO2: 50.5,
  TiO2: 1.5,
  Al2O3: 15.0,
  FeOt: 10.0,
  MnO: 0.2,
  MgO: 7.5,
  CaO: 11.5,
  Na2O: 2.5,
  K2O: 0.2,
  P2O5: 0.1
};

/** Default volatiles */
const defaultVolatiles: Volatiles = {
  H2O: 0.5
};

/** Default path (lava flow) */
const defaultPath: PTPath = {
  t_end_s: 86400, // 1 day
  T_points: [
    [0, 1200],
    [3600, 1100],
    [86400, 25]
  ],
  P_points: [
    [0, 100],
    [1800, 0.1],
    [86400, 0.1]
  ]
};

/** Default environment */
const defaultEnvironment: Environment = {
  emplacement: 'extrusive',
  system: 'open'
};

/** Create the default scenario */
function createDefaultScenario(): Scenario {
  return {
    version: '0.1',
    composition: { ...defaultComposition },
    volatiles: { ...defaultVolatiles },
    path: {
      ...defaultPath,
      T_points: defaultPath.T_points.map((p) => [...p] as [number, number]),
      P_points: defaultPath.P_points.map((p) => [...p] as [number, number])
    },
    environment: { ...defaultEnvironment }
  };
}

/** Main scenario store */
function createScenarioStore() {
  const { subscribe, set, update } = writable<Scenario>(createDefaultScenario());

  return {
    subscribe,
    set,
    update,

    /** Reset to default scenario */
    reset() {
      set(createDefaultScenario());
    },

    /** Update composition */
    setComposition(composition: Composition) {
      update((s) => ({ ...s, composition }));
    },

    /** Update a single oxide value */
    setOxide(oxide: keyof Composition, value: number) {
      update((s) => ({
        ...s,
        composition: { ...s.composition, [oxide]: value }
      }));
    },

    /** Update volatiles */
    setVolatiles(volatiles: Volatiles) {
      update((s) => ({ ...s, volatiles }));
    },

    /** Update H2O content */
    setH2O(value: number) {
      update((s) => ({
        ...s,
        volatiles: { ...s.volatiles, H2O: value }
      }));
    },

    /** Update path */
    setPath(path: PTPath) {
      update((s) => ({ ...s, path }));
    },

    /** Update environment */
    setEnvironment(environment: Environment) {
      update((s) => ({ ...s, environment }));
    },

    /** Set emplacement type */
    setEmplacement(emplacement: 'extrusive' | 'intrusive') {
      update((s) => ({
        ...s,
        environment: { ...s.environment, emplacement }
      }));
    },

    /** Set system type */
    setSystemType(system: 'open' | 'closed') {
      update((s) => ({
        ...s,
        environment: { ...s.environment, system }
      }));
    },

    /** Load scenario from JSON */
    loadScenario(scenario: Scenario) {
      set(scenario);
    }
  };
}

export const scenario = createScenarioStore();

/** Derived store for normalized composition total */
export const compositionTotal = derived(scenario, ($scenario) => {
  const comp = $scenario.composition;
  return (
    comp.SiO2 +
    comp.TiO2 +
    comp.Al2O3 +
    comp.FeOt +
    comp.MnO +
    comp.MgO +
    comp.CaO +
    comp.Na2O +
    comp.K2O +
    comp.P2O5
  );
});

/** Store for prediction results */
export const predictionResult = writable<PredictionResult | null>(null);

/** Store for prediction loading state */
export const isPredicting = writable(false);
