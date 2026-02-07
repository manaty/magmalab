/**
 * Crystallization timeline generator
 * Creates a narrative of the crystallization sequence
 */

import type {
  Composition,
  Volatiles,
  PTPath,
  Environment,
  TimelineEvent,
  MineralResult
} from './types';

/** Seconds in various time units */
const HOUR = 3600;
const DAY = 86400;
const YEAR = 31536000;

/**
 * Format time duration for display
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(0)} seconds`;
  if (seconds < HOUR) return `${(seconds / 60).toFixed(0)} minutes`;
  if (seconds < DAY) return `${(seconds / HOUR).toFixed(1)} hours`;
  if (seconds < YEAR) return `${(seconds / DAY).toFixed(1)} days`;
  return `${(seconds / YEAR).toFixed(1)} years`;
}

/**
 * Get liquidus temperature estimate based on composition
 * Simplified heuristic
 */
function estimateLiquidus(composition: Composition, volatiles: Volatiles): number {
  // Base liquidus depends on SiO2
  let liquidus = 1300 - (composition.SiO2 - 45) * 3;

  // Water lowers liquidus significantly
  liquidus -= volatiles.H2O * 30;

  // Alkalis also lower liquidus
  liquidus -= (composition.Na2O + composition.K2O) * 5;

  return Math.max(liquidus, 700);
}

/**
 * Get approximate solidus temperature
 */
function estimateSolidus(composition: Composition, volatiles: Volatiles): number {
  // Simplified: solidus is roughly 200-400C below liquidus
  const liquidus = estimateLiquidus(composition, volatiles);
  const range = 250 + volatiles.H2O * 30; // Wider range with more water
  return liquidus - range;
}

/**
 * Estimate when degassing occurs
 */
function estimateDegassingPoint(
  path: PTPath,
  volatiles: Volatiles
): { time: number; pressure: number } | null {
  if (volatiles.H2O < 0.5) return null;

  // Simplified H2O solubility: ~0.1 wt% per 10 MPa
  // Degassing when P drops below saturation pressure
  const saturationP = volatiles.H2O * 100; // MPa

  for (let i = 0; i < path.P_points.length - 1; i++) {
    const p1 = path.P_points[i];
    const p2 = path.P_points[i + 1];

    if (p1[1] >= saturationP && p2[1] < saturationP) {
      // Linear interpolation to find crossing point
      const fraction = (p1[1] - saturationP) / (p1[1] - p2[1]);
      const time = p1[0] + fraction * (p2[0] - p1[0]);
      return { time, pressure: saturationP };
    }
  }

  return null;
}

/**
 * Build crystallization timeline
 */
export function buildTimeline(
  composition: Composition,
  volatiles: Volatiles,
  path: PTPath,
  environment: Environment,
  minerals: MineralResult[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  let order = 1;

  const liquidus = estimateLiquidus(composition, volatiles);
  const solidus = estimateSolidus(composition, volatiles);
  const duration = path.t_end_s;
  const startT = path.T_points[0]?.[1] ?? 1200;

  // Initial state
  events.push({
    order: order++,
    timeDescription: 't = 0',
    event: 'Initial Magma State',
    details: `Magma at ${startT}C, ${path.P_points[0]?.[1].toFixed(0)} MPa. ${volatiles.H2O > 2 ? 'Water-rich' : volatiles.H2O > 0.5 ? 'Moderate water content' : 'Relatively dry'}.`
  });

  // Liquidus crossing
  const liquidusCrossingTime = duration * 0.05; // Simplified
  events.push({
    order: order++,
    timeDescription: `~${formatDuration(liquidusCrossingTime)}`,
    event: 'Crystallization Begins',
    details: `Temperature approaches liquidus (~${liquidus.toFixed(0)}C). First crystals nucleate.`
  });

  // Early crystallization - mafic minerals
  const earlyMinerals = minerals.filter(
    (m) =>
      m.category === 'primary' &&
      m.likelihood === 'likely' &&
      ['Olivine', 'Clinopyroxene (Augite)', 'Orthopyroxene'].includes(m.name)
  );

  if (earlyMinerals.length > 0) {
    events.push({
      order: order++,
      timeDescription: `~${formatDuration(duration * 0.1)}`,
      event: 'Early Crystallization',
      details: `${earlyMinerals.map((m) => m.name.split(' ')[0]).join(', ')} begin to crystallize as early high-temperature phases.`
    });
  }

  // Plagioclase
  const plagioclase = minerals.find((m) => m.name === 'Plagioclase');
  if (plagioclase && plagioclase.likelihood === 'likely') {
    events.push({
      order: order++,
      timeDescription: `~${formatDuration(duration * 0.2)}`,
      event: 'Plagioclase Crystallization',
      details: `Plagioclase feldspar joins the crystallizing assemblage. Composition depends on Ca/Na ratio.`
    });
  }

  // Degassing event (if open system)
  if (environment.system === 'open') {
    const degassing = estimateDegassingPoint(path, volatiles);
    if (degassing) {
      events.push({
        order: order++,
        timeDescription: `~${formatDuration(degassing.time)}`,
        event: 'Volatile Exsolution',
        details: `Pressure drops below H2O saturation (~${degassing.pressure.toFixed(0)} MPa). Gas bubbles form and escape${environment.emplacement === 'extrusive' ? ', potentially creating vesicular texture' : ''}.`
      });
    }
  }

  // Amphibole/biotite (if present)
  const hydrous = minerals.filter((m) =>
    ['Amphibole (Hornblende)', 'Biotite'].includes(m.name)
  );
  if (hydrous.length > 0 && hydrous.some((m) => m.likelihood === 'likely')) {
    events.push({
      order: order++,
      timeDescription: `~${formatDuration(duration * 0.4)}`,
      event: 'Hydrous Mineral Crystallization',
      details: `${hydrous
        .filter((m) => m.likelihood === 'likely')
        .map((m) => m.name.split(' ')[0])
        .join(', ')} crystallize, incorporating water into the structure.`
    });
  }

  // Late-stage felsic minerals
  const lateMinerals = minerals.filter(
    (m) =>
      m.likelihood === 'likely' &&
      ['Quartz', 'Alkali Feldspar'].includes(m.name)
  );

  if (lateMinerals.length > 0) {
    events.push({
      order: order++,
      timeDescription: `~${formatDuration(duration * 0.6)}`,
      event: 'Late-Stage Crystallization',
      details: `${lateMinerals.map((m) => m.name).join(' and ')} crystallize from the evolved, silica-rich residual melt.`
    });
  }

  // Final state
  const finalT = path.T_points[path.T_points.length - 1]?.[1] ?? 25;
  const crystalFraction =
    environment.emplacement === 'intrusive'
      ? '100%'
      : finalT < 700
        ? `~${Math.round((1 - (finalT > 500 ? 0.3 : 0.1)) * 100)}%`
        : '~50-70%';

  events.push({
    order: order++,
    timeDescription: `t = ${formatDuration(duration)}`,
    event: 'Final State',
    details: `Cooling complete at ${finalT}C. ${environment.emplacement === 'intrusive' ? 'Fully crystalline rock' : `Crystal fraction: ${crystalFraction}. ${finalT < 500 ? 'Any remaining melt quenched to glass.' : 'Melt may persist in pore spaces.'}`}`
  });

  return events;
}
