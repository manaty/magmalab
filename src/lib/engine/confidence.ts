/**
 * Confidence scoring for predictions
 * Assesses uncertainty based on input completeness and boundary conditions
 */

import type {
  Composition,
  Volatiles,
  PTPath,
  TASResult,
  ConfidenceResult,
  ConfidenceLevel
} from './types';

/**
 * Compute confidence score and factors
 */
export function computeConfidence(
  composition: Composition,
  volatiles: Volatiles,
  path: PTPath,
  tasResult: TASResult
): ConfidenceResult {
  const factors: string[] = [];
  let score = 1.0;

  // 1. Check TAS boundary distance
  // If close to boundary, classification is less certain
  if (tasResult.boundaryDistance < 0) {
    // Outside all fields
    score -= 0.4;
    factors.push('Composition plots outside standard TAS fields');
  } else if (tasResult.boundaryDistance < 1) {
    score -= 0.2;
    factors.push('Composition near TAS field boundary - classification could shift');
  } else if (tasResult.boundaryDistance < 2) {
    score -= 0.1;
    factors.push('Composition moderately close to TAS boundary');
  }

  // 2. Check composition normalization
  const total =
    composition.SiO2 +
    composition.TiO2 +
    composition.Al2O3 +
    composition.FeOt +
    composition.MnO +
    composition.MgO +
    composition.CaO +
    composition.Na2O +
    composition.K2O +
    composition.P2O5;

  if (Math.abs(total - 100) > 2) {
    score -= 0.15;
    factors.push(`Oxide total (${total.toFixed(1)}%) deviates from 100%`);
  }

  // 3. Check for missing/low critical values
  if (volatiles.H2O === 0) {
    score -= 0.1;
    factors.push('H2O not specified - mineral predictions less certain');
  }

  // 4. Check path reasonableness
  const startT = path.T_points[0]?.[1] ?? 0;
  const startP = path.P_points[0]?.[1] ?? 0;

  if (startT < 900) {
    score -= 0.15;
    factors.push(`Starting temperature (${startT}C) below typical magma temperatures`);
  } else if (startT > 1400) {
    score -= 0.1;
    factors.push(`Starting temperature (${startT}C) unusually high`);
  }

  if (startP < 0.1) {
    score -= 0.05;
    factors.push('Starting pressure very low for magma storage');
  } else if (startP > 1000) {
    score -= 0.1;
    factors.push(`Starting pressure (${startP} MPa) very high - unusual depth`);
  }

  // 5. Check for unusual compositions
  if (composition.SiO2 < 40) {
    score -= 0.15;
    factors.push('Very low SiO2 - ultramafic, model less calibrated');
  } else if (composition.SiO2 > 77) {
    score -= 0.1;
    factors.push('Very high SiO2 - high-silica rhyolite edge case');
  }

  const alkalis = composition.Na2O + composition.K2O;
  if (alkalis > 15) {
    score -= 0.15;
    factors.push('Unusually high alkali content');
  }

  // 6. Unusual mineral chemistry
  if (composition.TiO2 > 4) {
    score -= 0.05;
    factors.push('High TiO2 - some rules may not apply');
  }

  if (composition.P2O5 > 1.5) {
    score -= 0.05;
    factors.push('High P2O5 content unusual');
  }

  // Ensure score stays in valid range
  score = Math.max(0, Math.min(1, score));

  // Determine level
  let level: ConfidenceLevel;
  if (score >= 0.7) {
    level = 'high';
  } else if (score >= 0.4) {
    level = 'medium';
  } else {
    level = 'low';
  }

  // Add positive factors if no issues
  if (factors.length === 0) {
    factors.push('Input parameters within typical ranges');
    factors.push('Clear TAS classification');
  }

  return { level, score, factors };
}
