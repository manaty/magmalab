/**
 * Unit tests for the MagmaLab prediction engine
 */

import { describe, it, expect } from 'vitest';
import { classifyTAS } from './tas';
import { inferMinerals } from './minerals';
import { inferTexture } from './texture';
import { predict } from './index';
import type { Composition, Volatiles, PTPath, Environment, Scenario } from './types';

// Test compositions from presets
const MORB: Composition = {
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

const RHYOLITE: Composition = {
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
};

const ARC_ANDESITE: Composition = {
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
};

describe('TAS Classification', () => {
  it('classifies MORB as basalt', () => {
    const result = classifyTAS(MORB);
    expect(result.volcanicName).toBe('Basalt');
    expect(result.intrusiveName).toBe('Gabbro');
    expect(result.fieldCode).toBe('basalt');
  });

  it('classifies rhyolite correctly', () => {
    const result = classifyTAS(RHYOLITE);
    expect(result.volcanicName).toBe('Rhyolite');
    expect(result.intrusiveName).toBe('Granite');
  });

  it('classifies arc andesite as andesite', () => {
    const result = classifyTAS(ARC_ANDESITE);
    expect(result.volcanicName).toBe('Andesite');
    expect(result.intrusiveName).toBe('Diorite');
  });

  it('calculates total alkalis correctly', () => {
    const result = classifyTAS(MORB);
    expect(result.totalAlkalis).toBeCloseTo(2.7, 1);
  });
});

describe('Mineral Inference', () => {
  const defaultVolatiles: Volatiles = { H2O: 1.0 };
  const defaultPath: PTPath = {
    t_end_s: 86400,
    T_points: [[0, 1200], [86400, 25]],
    P_points: [[0, 100], [86400, 0.1]]
  };
  const defaultEnv: Environment = { emplacement: 'extrusive', system: 'open' };

  it('predicts olivine for mafic compositions', () => {
    const minerals = inferMinerals(MORB, defaultVolatiles, defaultPath, defaultEnv);
    const olivine = minerals.find((m) => m.name === 'Olivine');
    expect(olivine).toBeDefined();
    expect(olivine?.likelihood).toBe('possible');
  });

  it('predicts quartz for felsic compositions', () => {
    const minerals = inferMinerals(RHYOLITE, defaultVolatiles, defaultPath, defaultEnv);
    const quartz = minerals.find((m) => m.name === 'Quartz');
    expect(quartz).toBeDefined();
    expect(quartz?.likelihood).toBe('likely');
  });

  it('predicts amphibole with high water content', () => {
    const wetVolatiles: Volatiles = { H2O: 4.0 };
    const highPPath: PTPath = {
      t_end_s: 86400,
      T_points: [[0, 1100], [86400, 400]],
      P_points: [[0, 200], [86400, 100]]
    };
    const minerals = inferMinerals(ARC_ANDESITE, wetVolatiles, highPPath, defaultEnv);
    const amphibole = minerals.find((m) => m.name === 'Amphibole (Hornblende)');
    expect(amphibole).toBeDefined();
    expect(amphibole?.likelihood).toBe('likely');
  });
});

describe('Texture Inference', () => {
  it('predicts phaneritic texture for slow intrusive cooling', () => {
    const slowPath: PTPath = {
      t_end_s: 31536000 * 10, // 10 years
      T_points: [[0, 1100], [31536000 * 10, 400]],
      P_points: [[0, 400], [31536000 * 10, 400]]
    };
    const env: Environment = { emplacement: 'intrusive', system: 'closed' };

    const result = inferTexture(slowPath, env);
    expect(result.texture).toBe('phaneritic');
    expect(result.glassFraction).toBe(0);
  });

  it('predicts glassy texture for rapid quench', () => {
    const fastPath: PTPath = {
      t_end_s: 600, // 10 minutes
      T_points: [[0, 1200], [600, 25]],
      P_points: [[0, 30], [600, 30]]
    };
    const env: Environment = { emplacement: 'extrusive', system: 'closed' };

    const result = inferTexture(fastPath, env);
    expect(result.texture).toBe('glassy');
    expect(result.glassFraction).toBeGreaterThan(0.5);
  });

  it('predicts vesicular for open system with decompression', () => {
    const decompPath: PTPath = {
      t_end_s: 7200, // 2 hours
      T_points: [[0, 1200], [7200, 400]],
      P_points: [[0, 100], [7200, 0.1]]
    };
    const env: Environment = { emplacement: 'extrusive', system: 'open' };

    const result = inferTexture(decompPath, env);
    expect(result.texture).toBe('vesicular');
  });
});

describe('Full Prediction', () => {
  it('produces complete prediction for MORB lava flow', () => {
    const scenario: Scenario = {
      version: '0.1',
      composition: MORB,
      volatiles: { H2O: 0.5 },
      path: {
        t_end_s: 86400,
        T_points: [[0, 1200], [86400, 25]],
        P_points: [[0, 50], [86400, 0.1]]
      },
      environment: { emplacement: 'extrusive', system: 'open' }
    };

    const result = predict(scenario);

    expect(result.tas.volcanicName).toBe('Basalt');
    expect(result.minerals.length).toBeGreaterThan(0);
    expect(result.texture.texture).toBeDefined();
    expect(result.timeline.length).toBeGreaterThan(0);
    expect(result.confidence.level).toBeDefined();
  });

  it('produces different results for rhyolite pluton', () => {
    const scenario: Scenario = {
      version: '0.1',
      composition: RHYOLITE,
      volatiles: { H2O: 5.0 },
      path: {
        t_end_s: 31536000, // 1 year
        T_points: [[0, 1000], [31536000, 300]],
        P_points: [[0, 200], [31536000, 200]]
      },
      environment: { emplacement: 'intrusive', system: 'closed' }
    };

    const result = predict(scenario);

    expect(result.tas.intrusiveName).toBe('Granite');
    expect(result.texture.texture).toBe('phaneritic');
    expect(result.texture.glassFraction).toBe(0);
  });
});
