import type { CompositionPreset } from '$lib/engine/types';

/** Standard composition presets for common magma types */
export const compositionPresets: CompositionPreset[] = [
  {
    id: 'morb',
    name: 'MORB',
    description: 'Mid-Ocean Ridge Basalt - typical oceanic crust',
    composition: {
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
    },
    volatiles: { H2O: 0.3 }
  },
  {
    id: 'oib',
    name: 'OIB',
    description: 'Ocean Island Basalt - Hawaii-type hotspot',
    composition: {
      SiO2: 49.0,
      TiO2: 2.5,
      Al2O3: 13.5,
      FeOt: 11.5,
      MnO: 0.2,
      MgO: 8.0,
      CaO: 10.5,
      Na2O: 2.8,
      K2O: 0.8,
      P2O5: 0.3
    },
    volatiles: { H2O: 0.8 }
  },
  {
    id: 'alkali-basalt',
    name: 'Alkali Basalt',
    description: 'Alkaline basalt with higher Na+K',
    composition: {
      SiO2: 46.0,
      TiO2: 2.8,
      Al2O3: 14.5,
      FeOt: 12.0,
      MnO: 0.2,
      MgO: 8.5,
      CaO: 10.0,
      Na2O: 3.5,
      K2O: 1.5,
      P2O5: 0.5
    },
    volatiles: { H2O: 1.0 }
  },
  {
    id: 'arc-andesite',
    name: 'Arc Andesite',
    description: 'Typical subduction zone intermediate magma',
    composition: {
      SiO2: 58.0,
      TiO2: 0.9,
      Al2O3: 17.0,
      FeOt: 6.5,
      MnO: 0.1,
      MgO: 4.0,
      CaO: 7.0,
      Na2O: 3.5,
      K2O: 1.8,
      P2O5: 0.2
    },
    volatiles: { H2O: 3.5 }
  },
  {
    id: 'dacite',
    name: 'Dacite',
    description: 'Felsic volcanic rock, often explosive',
    composition: {
      SiO2: 65.0,
      TiO2: 0.6,
      Al2O3: 16.0,
      FeOt: 4.5,
      MnO: 0.1,
      MgO: 2.0,
      CaO: 4.5,
      Na2O: 4.0,
      K2O: 2.5,
      P2O5: 0.2
    },
    volatiles: { H2O: 4.0 }
  },
  {
    id: 'rhyolite',
    name: 'Rhyolite',
    description: 'Highly silicic volcanic magma',
    composition: {
      SiO2: 73.0,
      TiO2: 0.2,
      Al2O3: 13.5,
      FeOt: 2.0,
      MnO: 0.05,
      MgO: 0.5,
      CaO: 1.5,
      Na2O: 4.0,
      K2O: 4.5,
      P2O5: 0.05
    },
    volatiles: { H2O: 5.0 }
  },
  {
    id: 'trachyte',
    name: 'Trachyte',
    description: 'Alkali-rich, silica-intermediate volcanic',
    composition: {
      SiO2: 62.0,
      TiO2: 0.5,
      Al2O3: 17.5,
      FeOt: 4.0,
      MnO: 0.1,
      MgO: 0.8,
      CaO: 2.0,
      Na2O: 6.0,
      K2O: 5.5,
      P2O5: 0.2
    },
    volatiles: { H2O: 2.0 }
  },
  {
    id: 'phonolite',
    name: 'Phonolite',
    description: 'Highly alkaline, silica-undersaturated',
    composition: {
      SiO2: 56.0,
      TiO2: 0.4,
      Al2O3: 20.0,
      FeOt: 3.5,
      MnO: 0.2,
      MgO: 0.5,
      CaO: 1.5,
      Na2O: 8.5,
      K2O: 5.5,
      P2O5: 0.2
    },
    volatiles: { H2O: 2.5 }
  }
];
