/**
 * TAS (Total Alkali-Silica) classification engine
 * Based on Le Bas et al. (1986) classification
 */

import type { Composition, TASResult } from './types';

/** TAS field definition with polygon vertices */
interface TASField {
  code: string;
  volcanicName: string;
  intrusiveName: string;
  /** Polygon vertices as [SiO2, Na2O+K2O] */
  polygon: [number, number][];
}

/**
 * TAS diagram field definitions
 * Polygons defined clockwise from bottom-left
 * Based on IUGS classification (Le Bas et al., 1986)
 */
const TAS_FIELDS: TASField[] = [
  // Ultrabasic to basic
  {
    code: 'foidite',
    volcanicName: 'Foidite',
    intrusiveName: 'Foidolite',
    polygon: [
      [41, 3],
      [41, 7],
      [45, 9.4],
      [49.4, 7.3],
      [45, 5],
      [41, 3]
    ]
  },
  {
    code: 'picrobasalt',
    volcanicName: 'Picrobasalt',
    intrusiveName: 'Ultramafic',
    polygon: [
      [41, 0],
      [41, 3],
      [45, 3],
      [45, 0],
      [41, 0]
    ]
  },
  {
    code: 'basalt',
    volcanicName: 'Basalt',
    intrusiveName: 'Gabbro',
    polygon: [
      [45, 0],
      [45, 5],
      [52, 5],
      [52, 0],
      [45, 0]
    ]
  },
  {
    code: 'basaltic-andesite',
    volcanicName: 'Basaltic Andesite',
    intrusiveName: 'Gabbroic Diorite',
    polygon: [
      [52, 0],
      [52, 5],
      [57, 5.9],
      [57, 0],
      [52, 0]
    ]
  },
  {
    code: 'andesite',
    volcanicName: 'Andesite',
    intrusiveName: 'Diorite',
    polygon: [
      [57, 0],
      [57, 5.9],
      [63, 7],
      [63, 0],
      [57, 0]
    ]
  },
  {
    code: 'dacite',
    volcanicName: 'Dacite',
    intrusiveName: 'Granodiorite',
    polygon: [
      [63, 0],
      [63, 7],
      [69, 8],
      [69, 0],
      [63, 0]
    ]
  },
  {
    code: 'rhyolite',
    volcanicName: 'Rhyolite',
    intrusiveName: 'Granite',
    polygon: [
      [69, 0],
      [69, 8],
      [77, 8],
      [77, 0],
      [69, 0]
    ]
  },
  // Alkaline series
  {
    code: 'tephrite-basanite',
    volcanicName: 'Tephrite/Basanite',
    intrusiveName: 'Theralite',
    polygon: [
      [41, 3],
      [45, 5],
      [49.4, 7.3],
      [45, 9.4],
      [41, 7],
      [41, 3]
    ]
  },
  {
    code: 'trachybasalt',
    volcanicName: 'Trachybasalt',
    intrusiveName: 'Alkali Gabbro',
    polygon: [
      [45, 5],
      [52, 5],
      [49.4, 7.3],
      [45, 5]
    ]
  },
  {
    code: 'basaltic-trachyandesite',
    volcanicName: 'Basaltic Trachyandesite',
    intrusiveName: 'Monzogabbro',
    polygon: [
      [52, 5],
      [57, 5.9],
      [53, 9.3],
      [49.4, 7.3],
      [52, 5]
    ]
  },
  {
    code: 'trachyandesite',
    volcanicName: 'Trachyandesite',
    intrusiveName: 'Monzonite',
    polygon: [
      [57, 5.9],
      [63, 7],
      [57.6, 11.7],
      [53, 9.3],
      [57, 5.9]
    ]
  },
  {
    code: 'trachyte-trachydacite',
    volcanicName: 'Trachyte/Trachydacite',
    intrusiveName: 'Quartz Monzonite/Syenite',
    polygon: [
      [63, 7],
      [69, 8],
      [69, 12],
      [61, 13.5],
      [57.6, 11.7],
      [63, 7]
    ]
  },
  {
    code: 'phonotephrite',
    volcanicName: 'Phonotephrite',
    intrusiveName: 'Nepheline Monzodiorite',
    polygon: [
      [45, 9.4],
      [49.4, 7.3],
      [53, 9.3],
      [48.4, 11.5],
      [45, 9.4]
    ]
  },
  {
    code: 'tephriphonolite',
    volcanicName: 'Tephriphonolite',
    intrusiveName: 'Nepheline Monzosyenite',
    polygon: [
      [48.4, 11.5],
      [53, 9.3],
      [57.6, 11.7],
      [52.5, 14],
      [48.4, 11.5]
    ]
  },
  {
    code: 'phonolite',
    volcanicName: 'Phonolite',
    intrusiveName: 'Nepheline Syenite',
    polygon: [
      [52.5, 14],
      [57.6, 11.7],
      [61, 13.5],
      [57, 16],
      [52.5, 14]
    ]
  }
];

/**
 * Point-in-polygon test using ray casting algorithm
 */
function pointInPolygon(x: number, y: number, polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1];
    const xj = polygon[j][0],
      yj = polygon[j][1];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Calculate minimum distance from point to polygon edge
 */
function distanceToPolygon(x: number, y: number, polygon: [number, number][]): number {
  let minDist = Infinity;

  for (let i = 0; i < polygon.length - 1; i++) {
    const x1 = polygon[i][0],
      y1 = polygon[i][1];
    const x2 = polygon[i + 1][0],
      y2 = polygon[i + 1][1];

    // Distance from point to line segment
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    minDist = Math.min(minDist, dist);
  }

  return minDist;
}

/**
 * Classify composition using TAS diagram
 */
export function classifyTAS(composition: Composition): TASResult {
  const sio2 = composition.SiO2;
  const totalAlkalis = composition.Na2O + composition.K2O;

  // Find the field containing this point
  let bestField: TASField | null = null;
  let minBoundaryDistance = Infinity;

  for (const field of TAS_FIELDS) {
    if (pointInPolygon(sio2, totalAlkalis, field.polygon)) {
      const dist = distanceToPolygon(sio2, totalAlkalis, field.polygon);
      if (dist < minBoundaryDistance || !bestField) {
        bestField = field;
        minBoundaryDistance = dist;
      }
    }
  }

  // If not in any field, find nearest field
  if (!bestField) {
    for (const field of TAS_FIELDS) {
      const dist = distanceToPolygon(sio2, totalAlkalis, field.polygon);
      if (dist < minBoundaryDistance) {
        bestField = field;
        minBoundaryDistance = dist;
      }
    }
    // Negative distance indicates outside field
    minBoundaryDistance = -minBoundaryDistance;
  }

  // Default fallback
  if (!bestField) {
    bestField = TAS_FIELDS.find((f) => f.code === 'basalt')!;
    minBoundaryDistance = 0;
  }

  return {
    volcanicName: bestField.volcanicName,
    intrusiveName: bestField.intrusiveName,
    sio2,
    totalAlkalis,
    boundaryDistance: minBoundaryDistance,
    fieldCode: bestField.code
  };
}

/**
 * Get rock name based on TAS result and emplacement
 */
export function getRockName(
  tasResult: TASResult,
  emplacement: 'extrusive' | 'intrusive'
): string {
  return emplacement === 'extrusive' ? tasResult.volcanicName : tasResult.intrusiveName;
}
