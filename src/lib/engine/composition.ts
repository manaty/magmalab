/**
 * Composition utilities
 */

import type { Composition } from './types';

/**
 * Calculate the sum of all oxides
 */
export function getCompositionTotal(composition: Composition): number {
  return (
    composition.SiO2 +
    composition.TiO2 +
    composition.Al2O3 +
    composition.FeOt +
    composition.MnO +
    composition.MgO +
    composition.CaO +
    composition.Na2O +
    composition.K2O +
    composition.P2O5
  );
}

/**
 * Normalize composition to 100%
 */
export function normalizeComposition(composition: Composition): Composition {
  const total = getCompositionTotal(composition);
  if (total <= 0) return composition;

  const factor = 100 / total;
  return {
    SiO2: composition.SiO2 * factor,
    TiO2: composition.TiO2 * factor,
    Al2O3: composition.Al2O3 * factor,
    FeOt: composition.FeOt * factor,
    MnO: composition.MnO * factor,
    MgO: composition.MgO * factor,
    CaO: composition.CaO * factor,
    Na2O: composition.Na2O * factor,
    K2O: composition.K2O * factor,
    P2O5: composition.P2O5 * factor
  };
}

/**
 * Validate composition values
 */
export function validateComposition(
  composition: Composition
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for negative values
  for (const [key, value] of Object.entries(composition)) {
    if (value < 0) {
      errors.push(`${key} cannot be negative`);
    }
  }

  // Check for reasonable ranges
  if (composition.SiO2 < 35 || composition.SiO2 > 85) {
    errors.push('SiO2 should be between 35-85%');
  }

  const total = getCompositionTotal(composition);
  if (total < 90 || total > 110) {
    errors.push(`Oxide total (${total.toFixed(1)}%) is outside reasonable range`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get simple composition classification
 */
export function getCompositionClass(
  composition: Composition
): 'ultramafic' | 'mafic' | 'intermediate' | 'felsic' {
  if (composition.SiO2 < 45) return 'ultramafic';
  if (composition.SiO2 < 52) return 'mafic';
  if (composition.SiO2 < 63) return 'intermediate';
  return 'felsic';
}
