/**
 * MagmaLab Prediction Engine
 * Main entry point for rock prediction
 */

import type { Scenario, PredictionResult } from './types';
import { classifyTAS } from './tas';
import { inferMinerals } from './minerals';
import { inferTexture } from './texture';
import { buildTimeline } from './timeline';
import { computeConfidence } from './confidence';

export { classifyTAS } from './tas';
export { inferMinerals } from './minerals';
export { inferTexture } from './texture';
export { buildTimeline } from './timeline';
export { computeConfidence } from './confidence';
export { normalizeComposition, validateComposition, getCompositionClass } from './composition';
export * from './types';

/**
 * Run full prediction on a scenario
 */
export function predict(scenario: Scenario): PredictionResult {
  const { composition, volatiles, path, environment } = scenario;

  // 1. TAS classification
  const tas = classifyTAS(composition);

  // 2. Mineral assemblage
  const minerals = inferMinerals(composition, volatiles, path, environment);

  // 3. Texture
  const texture = inferTexture(path, environment);

  // 4. Timeline
  const timeline = buildTimeline(composition, volatiles, path, environment, minerals);

  // 5. Confidence
  const confidence = computeConfidence(composition, volatiles, path, tas);

  return {
    tas,
    minerals,
    texture,
    timeline,
    confidence
  };
}
