/**
 * Visual preset archive for quick rollbacks / experiments.
 * Keep these values even when not currently active in the UI.
 */

export type GrainientPreset = {
  name: string;
  light: [string, string, string, string, string];
  dark: [string, string, string, string, string];
  settings: {
    accentStrength: number;
    timeSpeed: number;
    warpStrength: number;
    warpFrequency: number;
    warpSpeed: number;
    warpAmplitude: number;
    rotationAmount: number;
    grainAmount: number;
    grainScale: number;
    contrast: number;
    saturation: number;
    zoom: number;
  };
};

export const GRAINIENT_BLUE_PRESET: GrainientPreset = {
  name: 'blue-home-background',
  light: ['#5b8ae8', '#2d4ab4', '#c8d8f8', '#f0f4ff', '#c45810'],
  dark: ['#1e4db7', '#0a1640', '#0f2060', '#060b1e', '#8b3a0a'],
  settings: {
    accentStrength: 0.22,
    timeSpeed: 0.5,
    warpStrength: 1.8,
    warpFrequency: 5.0,
    warpSpeed: 3.5,
    warpAmplitude: 40.0,
    rotationAmount: 500.0,
    grainAmount: 0.08,
    grainScale: 2.0,
    contrast: 1.5,
    saturation: 1.0,
    zoom: 0.9,
  },
};

/**
 * Basketball background archive notes:
 * - Component file: `src/components/Basketball.astro`
 * - Model asset: `public/3D-MODELS/BasketBall.glb`
 * - Typical usage: render `<Basketball />` from `src/pages/index.astro`
 * - Layering: component uses fixed canvas with `z-index: 4`
 */
export const BASKETBALL_BACKGROUND_ARCHIVE = {
  componentPath: 'src/components/Basketball.astro',
  modelPath: 'public/3D-MODELS/BasketBall.glb',
  usageExample: '<Basketball />',
} as const;
