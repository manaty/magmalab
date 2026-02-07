/**
 * Mineral assemblage inference engine
 * Uses simplified heuristic rules based on composition and conditions
 */

import type { Composition, Volatiles, PTPath, Environment, MineralResult } from './types';

interface MineralRule {
  mineral: string;
  /** Function that returns likelihood and explanation */
  evaluate: (
    comp: Composition,
    volatiles: Volatiles,
    path: PTPath,
    env: Environment
  ) => { likelihood: 'likely' | 'possible' | 'unlikely'; explanation: string } | null;
  category: 'primary' | 'secondary' | 'accessory';
}

/** Get average pressure from path */
function getAvgPressure(path: PTPath): number {
  const points = path.P_points;
  if (points.length === 0) return 0;
  return points.reduce((sum, p) => sum + p[1], 0) / points.length;
}

/** Get max pressure from path */
function getMaxPressure(path: PTPath): number {
  return Math.max(...path.P_points.map((p) => p[1]));
}

/** Get starting temperature */
function getStartTemp(path: PTPath): number {
  return path.T_points[0]?.[1] ?? 1200;
}

/** Mineral inference rules */
const MINERAL_RULES: MineralRule[] = [
  // Olivine
  {
    mineral: 'Olivine',
    category: 'primary',
    evaluate: (comp) => {
      if (comp.SiO2 > 52) {
        return { likelihood: 'unlikely', explanation: 'SiO2 too high (>52%) for olivine stability' };
      }
      if (comp.MgO < 5) {
        return { likelihood: 'possible', explanation: 'Low MgO limits olivine abundance' };
      }
      if (comp.SiO2 < 48 && comp.MgO > 8) {
        return {
          likelihood: 'likely',
          explanation: `Low SiO2 (${comp.SiO2.toFixed(1)}%) and high MgO (${comp.MgO.toFixed(1)}%) favor olivine`
        };
      }
      return {
        likelihood: 'possible',
        explanation: 'Moderate SiO2 allows some olivine'
      };
    }
  },

  // Clinopyroxene (Augite)
  {
    mineral: 'Clinopyroxene (Augite)',
    category: 'primary',
    evaluate: (comp) => {
      if (comp.SiO2 > 65) {
        return { likelihood: 'unlikely', explanation: 'Too silicic for pyroxene' };
      }
      if (comp.CaO > 8 && comp.MgO > 4) {
        return {
          likelihood: 'likely',
          explanation: `High CaO (${comp.CaO.toFixed(1)}%) and MgO favor clinopyroxene`
        };
      }
      if (comp.SiO2 < 55) {
        return { likelihood: 'likely', explanation: 'Mafic composition favors pyroxene' };
      }
      return { likelihood: 'possible', explanation: 'Intermediate composition may contain pyroxene' };
    }
  },

  // Orthopyroxene
  {
    mineral: 'Orthopyroxene',
    category: 'primary',
    evaluate: (comp) => {
      if (comp.SiO2 < 48 || comp.SiO2 > 65) {
        return null;
      }
      if (comp.MgO > 5 && comp.CaO < 10) {
        return {
          likelihood: 'possible',
          explanation: 'Intermediate SiO2 with moderate MgO allows orthopyroxene'
        };
      }
      return null;
    }
  },

  // Plagioclase
  {
    mineral: 'Plagioclase',
    category: 'primary',
    evaluate: (comp) => {
      if (comp.Al2O3 < 10) {
        return { likelihood: 'unlikely', explanation: 'Low Al2O3 limits plagioclase' };
      }
      const anorthite = comp.CaO > 8; // Ca-rich
      const albite = comp.Na2O > 3; // Na-rich
      if (anorthite) {
        return {
          likelihood: 'likely',
          explanation: `High CaO (${comp.CaO.toFixed(1)}%) favors Ca-plagioclase (labradorite-anorthite)`
        };
      }
      if (albite) {
        return {
          likelihood: 'likely',
          explanation: `High Na2O (${comp.Na2O.toFixed(1)}%) favors Na-plagioclase (oligoclase-albite)`
        };
      }
      return { likelihood: 'likely', explanation: 'Plagioclase is common in most igneous rocks' };
    }
  },

  // Alkali Feldspar
  {
    mineral: 'Alkali Feldspar',
    category: 'primary',
    evaluate: (comp) => {
      const alkalis = comp.Na2O + comp.K2O;
      if (comp.K2O > 3) {
        return {
          likelihood: 'likely',
          explanation: `High K2O (${comp.K2O.toFixed(1)}%) favors K-feldspar (orthoclase/sanidine)`
        };
      }
      if (comp.SiO2 > 63 && alkalis > 6) {
        return {
          likelihood: 'likely',
          explanation: 'Felsic, alkali-rich composition favors alkali feldspar'
        };
      }
      if (comp.SiO2 > 60) {
        return { likelihood: 'possible', explanation: 'Felsic rocks commonly contain alkali feldspar' };
      }
      return null;
    }
  },

  // Quartz
  {
    mineral: 'Quartz',
    category: 'primary',
    evaluate: (comp) => {
      if (comp.SiO2 < 52) {
        return { likelihood: 'unlikely', explanation: 'Too mafic for quartz saturation' };
      }
      if (comp.SiO2 > 68) {
        return {
          likelihood: 'likely',
          explanation: `High SiO2 (${comp.SiO2.toFixed(1)}%) ensures quartz saturation`
        };
      }
      if (comp.SiO2 > 60) {
        return { likelihood: 'possible', explanation: 'Intermediate-felsic may contain minor quartz' };
      }
      return null;
    }
  },

  // Amphibole (Hornblende)
  {
    mineral: 'Amphibole (Hornblende)',
    category: 'primary',
    evaluate: (comp, volatiles, path) => {
      const maxP = getMaxPressure(path);
      if (volatiles.H2O < 2) {
        return { likelihood: 'unlikely', explanation: 'H2O too low (<2%) for amphibole stability' };
      }
      if (maxP < 50) {
        return { likelihood: 'unlikely', explanation: 'Pressure too low for amphibole stability' };
      }
      if (volatiles.H2O >= 3 && maxP >= 100) {
        return {
          likelihood: 'likely',
          explanation: `High H2O (${volatiles.H2O.toFixed(1)}%) and P (${maxP.toFixed(0)} MPa) favor amphibole`
        };
      }
      return { likelihood: 'possible', explanation: 'Moderate H2O and pressure allow some amphibole' };
    }
  },

  // Biotite
  {
    mineral: 'Biotite',
    category: 'primary',
    evaluate: (comp, volatiles, path) => {
      if (volatiles.H2O < 2) {
        return null;
      }
      if (comp.K2O < 1) {
        return { likelihood: 'unlikely', explanation: 'Low K2O limits biotite formation' };
      }
      if (comp.SiO2 > 55 && comp.K2O > 2 && volatiles.H2O > 3) {
        return {
          likelihood: 'likely',
          explanation: `High K2O (${comp.K2O.toFixed(1)}%) and H2O favor biotite`
        };
      }
      return { likelihood: 'possible', explanation: 'Moderate conditions allow biotite' };
    }
  },

  // Magnetite
  {
    mineral: 'Magnetite',
    category: 'accessory',
    evaluate: (comp) => {
      if (comp.FeOt > 5) {
        return {
          likelihood: 'likely',
          explanation: `FeO* (${comp.FeOt.toFixed(1)}%) provides iron for magnetite`
        };
      }
      return { likelihood: 'possible', explanation: 'Some Fe-oxide expected' };
    }
  },

  // Ilmenite
  {
    mineral: 'Ilmenite',
    category: 'accessory',
    evaluate: (comp) => {
      if (comp.TiO2 > 1 && comp.FeOt > 5) {
        return {
          likelihood: 'likely',
          explanation: `TiO2 (${comp.TiO2.toFixed(1)}%) and FeO* favor ilmenite`
        };
      }
      if (comp.TiO2 > 0.5) {
        return { likelihood: 'possible', explanation: 'Moderate TiO2 allows ilmenite' };
      }
      return null;
    }
  },

  // Apatite
  {
    mineral: 'Apatite',
    category: 'accessory',
    evaluate: (comp) => {
      if (comp.P2O5 > 0.3) {
        return {
          likelihood: 'likely',
          explanation: `P2O5 (${comp.P2O5.toFixed(2)}%) requires apatite crystallization`
        };
      }
      if (comp.P2O5 > 0.1) {
        return { likelihood: 'possible', explanation: 'Minor apatite expected' };
      }
      return null;
    }
  },

  // Nepheline (silica-undersaturated)
  {
    mineral: 'Nepheline',
    category: 'primary',
    evaluate: (comp) => {
      const alkalis = comp.Na2O + comp.K2O;
      if (comp.SiO2 < 50 && alkalis > 8) {
        return {
          likelihood: 'likely',
          explanation: 'Low SiO2 + high alkalis indicates silica undersaturation (nepheline forms)'
        };
      }
      if (comp.SiO2 < 48 && alkalis > 6) {
        return { likelihood: 'possible', explanation: 'May be silica-undersaturated' };
      }
      return null;
    }
  }
];

/**
 * Infer mineral assemblage from composition and conditions
 */
export function inferMinerals(
  composition: Composition,
  volatiles: Volatiles,
  path: PTPath,
  environment: Environment
): MineralResult[] {
  const results: MineralResult[] = [];

  for (const rule of MINERAL_RULES) {
    const result = rule.evaluate(composition, volatiles, path, environment);
    if (result && result.likelihood !== 'unlikely') {
      results.push({
        name: rule.mineral,
        category: rule.category,
        likelihood: result.likelihood,
        explanation: result.explanation
      });
    }
  }

  // Sort by category then likelihood
  const categoryOrder = { primary: 0, secondary: 1, accessory: 2 };
  const likelihoodOrder = { likely: 0, possible: 1, unlikely: 2 };

  results.sort((a, b) => {
    const catDiff = categoryOrder[a.category] - categoryOrder[b.category];
    if (catDiff !== 0) return catDiff;
    return likelihoodOrder[a.likelihood] - likelihoodOrder[b.likelihood];
  });

  return results;
}
