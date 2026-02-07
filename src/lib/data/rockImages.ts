/**
 * Rock image data and mappings
 * Real photos from Wikimedia Commons with SVG fallback
 *
 * Image Attribution - see /rocks/ATTRIBUTIONS.md for full details
 * All images from Wikimedia Commons under CC/Public Domain licenses
 */

export interface RockImageInfo {
  /** Primary color of the rock */
  color: string;
  /** Secondary/accent color */
  accentColor: string;
  /** Texture pattern type */
  pattern: 'solid' | 'speckled' | 'banded' | 'vesicular' | 'glassy' | 'crystalline';
  /** Short description for alt text */
  description: string;
  /** Path to real photo if available */
  photoPath?: string;
}

/** Rock image information keyed by TAS field code or texture */
export const rockImages: Record<string, RockImageInfo> = {
  // Mafic volcanic
  'basalt': {
    color: '#2d2d2d',
    accentColor: '#4a4a4a',
    pattern: 'solid',
    description: 'Dark, fine-grained volcanic rock',
    photoPath: '/rocks/basalt.jpg'
  },
  'picrobasalt': {
    color: '#1a1a1a',
    accentColor: '#3d3d3d',
    pattern: 'speckled',
    description: 'Very dark, olivine-rich volcanic rock'
  },

  // Intermediate volcanic
  'basaltic-andesite': {
    color: '#3d3d3d',
    accentColor: '#5a5a5a',
    pattern: 'solid',
    description: 'Dark gray, fine-grained volcanic rock'
  },
  'andesite': {
    color: '#5a5a5a',
    accentColor: '#787878',
    pattern: 'speckled',
    description: 'Medium gray volcanic rock with small phenocrysts',
    photoPath: '/rocks/andesite.jpg'
  },
  'dacite': {
    color: '#787878',
    accentColor: '#969696',
    pattern: 'speckled',
    description: 'Light gray volcanic rock',
    photoPath: '/rocks/dacite.jpg'
  },

  // Felsic volcanic
  'rhyolite': {
    color: '#c4b8a8',
    accentColor: '#e0d4c4',
    pattern: 'banded',
    description: 'Light-colored, silica-rich volcanic rock',
    photoPath: '/rocks/rhyolite.jpg'
  },

  // Alkaline volcanic
  'tephrite-basanite': {
    color: '#2a2a2a',
    accentColor: '#454545',
    pattern: 'solid',
    description: 'Dark alkaline volcanic rock'
  },
  'trachybasalt': {
    color: '#3a3a3a',
    accentColor: '#555555',
    pattern: 'solid',
    description: 'Dark alkaline volcanic rock'
  },
  'basaltic-trachyandesite': {
    color: '#4a4a4a',
    accentColor: '#656565',
    pattern: 'speckled',
    description: 'Gray alkaline volcanic rock'
  },
  'trachyandesite': {
    color: '#6a6a6a',
    accentColor: '#858585',
    pattern: 'speckled',
    description: 'Gray alkaline volcanic rock'
  },
  'trachyte-trachydacite': {
    color: '#a09080',
    accentColor: '#c0b0a0',
    pattern: 'banded',
    description: 'Light alkaline volcanic rock',
    photoPath: '/rocks/trachyte.jpg'
  },
  'phonotephrite': {
    color: '#404040',
    accentColor: '#606060',
    pattern: 'solid',
    description: 'Dark alkaline volcanic rock'
  },
  'tephriphonolite': {
    color: '#505050',
    accentColor: '#707070',
    pattern: 'speckled',
    description: 'Gray alkaline volcanic rock'
  },
  'phonolite': {
    color: '#707060',
    accentColor: '#909080',
    pattern: 'banded',
    description: 'Greenish-gray alkaline volcanic rock',
    photoPath: '/rocks/phonolite.jpg'
  },
  'foidite': {
    color: '#353535',
    accentColor: '#505050',
    pattern: 'speckled',
    description: 'Dark, silica-undersaturated volcanic rock',
    photoPath: '/rocks/foidite.jpg'
  },

  // Plutonic equivalents
  'gabbro': {
    color: '#252525',
    accentColor: '#454545',
    pattern: 'crystalline',
    description: 'Dark, coarse-grained intrusive rock',
    photoPath: '/rocks/gabbro.jpg'
  },
  'diorite': {
    color: '#505050',
    accentColor: '#808080',
    pattern: 'crystalline',
    description: 'Salt-and-pepper intrusive rock',
    photoPath: '/rocks/diorite.jpg'
  },
  'granodiorite': {
    color: '#808080',
    accentColor: '#b0b0b0',
    pattern: 'crystalline',
    description: 'Light gray coarse-grained intrusive rock',
    photoPath: '/rocks/granodiorite.jpg'
  },
  'granite': {
    color: '#d0c0b0',
    accentColor: '#f0e0d0',
    pattern: 'crystalline',
    description: 'Light-colored, coarse-grained intrusive rock',
    photoPath: '/rocks/granite.jpg'
  },

  // Textures
  'glassy': {
    color: '#1a1a1a',
    accentColor: '#333333',
    pattern: 'glassy',
    description: 'Volcanic glass (obsidian)',
    photoPath: '/rocks/obsidian.jpg'
  },
  'vesicular': {
    color: '#3a3a3a',
    accentColor: '#5a5a5a',
    pattern: 'vesicular',
    description: 'Bubbly volcanic rock (scoria/pumice)',
    photoPath: '/rocks/vesicular.jpg'
  },
  'porphyritic': {
    color: '#6a6a6a',
    accentColor: '#909090',
    pattern: 'speckled',
    description: 'Rock with large crystals in fine matrix',
    photoPath: '/rocks/porphyritic.jpg'
  }
};

/**
 * Get rock image info by TAS field code
 */
export function getRockImageInfo(fieldCode: string): RockImageInfo {
  return rockImages[fieldCode] ?? {
    color: '#555555',
    accentColor: '#777777',
    pattern: 'solid',
    description: 'Igneous rock sample'
  };
}

/**
 * Generate SVG data URL for a rock image
 */
export function generateRockSvg(info: RockImageInfo, size = 256): string {
  const patterns: Record<string, string> = {
    solid: `
      <rect width="100%" height="100%" fill="${info.color}"/>
      <rect width="100%" height="100%" fill="${info.accentColor}" opacity="0.3"/>
    `,
    speckled: `
      <rect width="100%" height="100%" fill="${info.color}"/>
      ${generateSpeckles(info.accentColor, size)}
    `,
    banded: `
      <rect width="100%" height="100%" fill="${info.color}"/>
      ${generateBands(info.accentColor, size)}
    `,
    vesicular: `
      <rect width="100%" height="100%" fill="${info.color}"/>
      ${generateVesicles(info.accentColor, size)}
    `,
    glassy: `
      <defs>
        <linearGradient id="glassy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${info.color}"/>
          <stop offset="50%" style="stop-color:${info.accentColor}"/>
          <stop offset="100%" style="stop-color:${info.color}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#glassy)"/>
      <rect width="100%" height="100%" fill="white" opacity="0.1"/>
    `,
    crystalline: `
      <rect width="100%" height="100%" fill="${info.color}"/>
      ${generateCrystals(info.accentColor, size)}
    `
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${patterns[info.pattern] || patterns.solid}
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function generateSpeckles(color: string, size: number): string {
  const speckles: string[] = [];
  const count = Math.floor(size * size / 200);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 3;
    speckles.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${0.3 + Math.random() * 0.4}"/>`);
  }
  return speckles.join('');
}

function generateBands(color: string, size: number): string {
  const bands: string[] = [];
  const bandHeight = size / 8;
  for (let i = 0; i < 8; i++) {
    const y = i * bandHeight + (Math.random() - 0.5) * 10;
    const height = bandHeight * (0.3 + Math.random() * 0.4);
    bands.push(`<rect x="0" y="${y}" width="${size}" height="${height}" fill="${color}" opacity="${0.2 + Math.random() * 0.3}"/>`);
  }
  return bands.join('');
}

function generateVesicles(color: string, size: number): string {
  const vesicles: string[] = [];
  const count = Math.floor(size * size / 800);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 3 + Math.random() * 10;
    vesicles.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.6"/>`);
  }
  return vesicles.join('');
}

function generateCrystals(color: string, size: number): string {
  const crystals: string[] = [];
  const count = Math.floor(size * size / 600);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = 5 + Math.random() * 15;
    const h = 5 + Math.random() * 15;
    const angle = Math.random() * 360;
    crystals.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="${0.4 + Math.random() * 0.4}" transform="rotate(${angle} ${x + w/2} ${y + h/2})"/>`);
  }
  return crystals.join('');
}
