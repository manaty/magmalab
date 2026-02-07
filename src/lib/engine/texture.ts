/**
 * Texture inference engine
 * Determines rock texture based on cooling rate and environment
 */

import type { PTPath, Environment, TextureResult, TextureType } from './types';

/** Seconds in various time units */
const HOUR = 3600;
const DAY = 86400;
const YEAR = 31536000;

/**
 * Calculate cooling rate proxy from path
 * Returns degrees per second (simplified)
 */
function getCoolingRate(path: PTPath): number {
  const points = path.T_points;
  if (points.length < 2) return 0;

  const startT = points[0][1];
  const endT = points[points.length - 1][1];
  const duration = path.t_end_s;

  if (duration === 0) return Infinity;
  return (startT - endT) / duration;
}

/**
 * Calculate decompression rate proxy
 * Returns MPa per second
 */
function getDecompressionRate(path: PTPath): number {
  const points = path.P_points;
  if (points.length < 2) return 0;

  const startP = points[0][1];
  const endP = points[points.length - 1][1];
  const duration = path.t_end_s;

  if (duration === 0) return Infinity;
  return (startP - endP) / duration;
}

/**
 * Detect two-stage cooling (slow then fast)
 * Returns true if there's a significant rate change
 */
function hasTwoStageCooling(path: PTPath): boolean {
  const points = path.T_points;
  if (points.length < 3) return false;

  // Check if there's a period of slow cooling followed by rapid cooling
  // Look for a significant rate change
  for (let i = 1; i < points.length - 1; i++) {
    const rate1 = (points[i - 1][1] - points[i][1]) / (points[i][0] - points[i - 1][0]);
    const rate2 = (points[i][1] - points[i + 1][1]) / (points[i + 1][0] - points[i][0]);

    // If second rate is >10x the first rate, consider it two-stage
    if (rate2 > rate1 * 10 && rate1 > 0 && rate2 > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate glass fraction estimate based on cooling conditions
 */
function estimateGlassFraction(
  path: PTPath,
  environment: Environment
): number {
  const coolingRate = getCoolingRate(path);
  const duration = path.t_end_s;

  // Intrusive = no glass
  if (environment.emplacement === 'intrusive') {
    return 0;
  }

  // Very fast cooling (< 1 hour) = mostly glass
  if (duration < HOUR) {
    return 0.9;
  }

  // Fast cooling (< 1 day) = significant glass
  if (duration < DAY) {
    return 0.5;
  }

  // Moderate cooling (< 1 week) = some glass
  if (duration < DAY * 7) {
    return 0.2;
  }

  // Slow cooling = little to no glass
  return 0.05;
}

/**
 * Infer texture from path and environment
 */
export function inferTexture(path: PTPath, environment: Environment): TextureResult {
  const duration = path.t_end_s;
  const coolingRate = getCoolingRate(path);
  const decompressionRate = getDecompressionRate(path);
  const twoStage = hasTwoStageCooling(path);
  const glassFraction = estimateGlassFraction(path, environment);

  let texture: TextureType;
  let description: string;
  let explanation: string;

  // Intrusive rocks
  if (environment.emplacement === 'intrusive') {
    if (duration > YEAR * 10) {
      texture = 'phaneritic';
      description =
        'Coarse-grained texture with crystals visible to naked eye (>1mm)';
      explanation = `Very slow cooling over ${(duration / YEAR).toFixed(0)}+ years allows large crystal growth`;
    } else if (duration > YEAR) {
      texture = 'phaneritic';
      description = 'Medium to coarse-grained texture with visible crystals';
      explanation = `Slow cooling over ${(duration / YEAR).toFixed(1)} years produces visible crystals`;
    } else if (duration > DAY * 30) {
      texture = 'phaneritic';
      description = 'Fine to medium-grained plutonic texture';
      explanation = 'Moderate cooling rate in intrusive setting produces fine-grained crystals';
    } else {
      texture = 'porphyritic';
      description = 'Porphyritic with larger crystals in finer groundmass';
      explanation =
        'Relatively rapid cooling for intrusive setting may produce porphyritic texture';
    }
  }
  // Extrusive rocks
  else {
    // Two-stage cooling = porphyritic
    if (twoStage) {
      texture = 'porphyritic';
      description = 'Large phenocrysts in fine-grained or glassy groundmass';
      explanation =
        'Two-stage cooling: slow cooling at depth grew phenocrysts, rapid cooling at surface formed groundmass';
    }
    // Very rapid cooling = glassy
    else if (duration < HOUR / 2 || glassFraction > 0.7) {
      texture = 'glassy';
      description = 'Glassy (obsidian-like) texture with no visible crystals';
      explanation = `Extremely rapid cooling (${duration < 60 ? duration + 's' : (duration / 60).toFixed(0) + ' min'}) quenched magma to glass`;
    }
    // Rapid cooling = aphanitic
    else if (duration < DAY * 7) {
      // Check for vesiculation
      if (
        environment.system === 'open' &&
        decompressionRate > 0.001 // Significant decompression
      ) {
        texture = 'vesicular';
        description = 'Vesicular texture with gas bubbles (vesicles)';
        explanation =
          'Open-system degassing during rapid decompression created gas bubbles that were preserved';
      } else {
        texture = 'aphanitic';
        description = 'Fine-grained texture with crystals too small to see without magnification';
        explanation = `Moderate cooling over ${duration < DAY ? (duration / HOUR).toFixed(1) + ' hours' : (duration / DAY).toFixed(1) + ' days'} produced microcrystalline texture`;
      }
    }
    // Slower extrusive = aphanitic or porphyritic
    else {
      texture = 'aphanitic';
      description = 'Fine-grained volcanic texture';
      explanation = 'Extended but still relatively rapid cooling produced fine crystals';
    }
  }

  return {
    texture,
    description,
    explanation,
    glassFraction
  };
}
