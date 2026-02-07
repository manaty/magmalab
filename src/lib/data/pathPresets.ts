import type { PathPreset } from '$lib/engine/types';

/** Standard P-T-t path presets */
export const pathPresets: PathPreset[] = [
  {
    id: 'lava-flow',
    name: 'Lava Flow',
    description: 'Rapid surface cooling over hours to days',
    path: {
      t_end_s: 86400, // 1 day
      T_points: [
        [0, 1200],
        [1800, 1100], // 30 min
        [7200, 900], // 2 hours
        [86400, 25] // 1 day
      ],
      P_points: [
        [0, 50], // Starting at shallow depth
        [600, 0.1], // Rapid decompression to surface
        [86400, 0.1]
      ]
    },
    environment: {
      emplacement: 'extrusive',
      system: 'open'
    }
  },
  {
    id: 'explosive-eruption',
    name: 'Explosive Eruption',
    description: 'Rapid quench during pyroclastic eruption',
    path: {
      t_end_s: 3600, // 1 hour
      T_points: [
        [0, 1100],
        [60, 800], // 1 min - rapid cooling
        [600, 400], // 10 min
        [3600, 25]
      ],
      P_points: [
        [0, 150],
        [30, 0.1], // Very rapid decompression
        [3600, 0.1]
      ]
    },
    environment: {
      emplacement: 'extrusive',
      system: 'open'
    }
  },
  {
    id: 'shallow-dike',
    name: 'Shallow Dike',
    description: 'Moderate cooling in a near-surface intrusion',
    path: {
      t_end_s: 604800, // 1 week
      T_points: [
        [0, 1180],
        [86400, 900], // 1 day
        [259200, 600], // 3 days
        [604800, 200] // 1 week
      ],
      P_points: [
        [0, 30],
        [604800, 25]
      ]
    },
    environment: {
      emplacement: 'intrusive',
      system: 'closed'
    }
  },
  {
    id: 'shallow-pluton',
    name: 'Shallow Pluton',
    description: 'Slow cooling at 2-5 km depth',
    path: {
      t_end_s: 31536000, // 1 year
      T_points: [
        [0, 1150],
        [2592000, 900], // 30 days
        [15768000, 600], // 6 months
        [31536000, 300] // 1 year
      ],
      P_points: [
        [0, 100],
        [31536000, 100]
      ]
    },
    environment: {
      emplacement: 'intrusive',
      system: 'closed'
    }
  },
  {
    id: 'deep-pluton',
    name: 'Deep Pluton',
    description: 'Very slow cooling at 10-15 km depth',
    path: {
      t_end_s: 315360000, // 10 years (simplified - real plutons cool over 100k+ years)
      T_points: [
        [0, 1100],
        [31536000, 900], // 1 year
        [157680000, 600], // 5 years
        [315360000, 400] // 10 years
      ],
      P_points: [
        [0, 400],
        [315360000, 400]
      ]
    },
    environment: {
      emplacement: 'intrusive',
      system: 'closed'
    }
  },
  {
    id: 'submarine-eruption',
    name: 'Submarine Eruption',
    description: 'Rapid quench under water pressure',
    path: {
      t_end_s: 600, // 10 minutes
      T_points: [
        [0, 1200],
        [10, 800], // 10 sec - very rapid quench
        [60, 200],
        [600, 5]
      ],
      P_points: [
        [0, 30], // ~3km depth
        [5, 30], // Stays at pressure
        [600, 30]
      ]
    },
    environment: {
      emplacement: 'extrusive',
      system: 'closed' // Water pressure inhibits degassing
    }
  },
  {
    id: 'two-stage',
    name: 'Two-Stage Cooling',
    description: 'Slow intrusive start, then rapid extrusive finish',
    path: {
      t_end_s: 2592000, // 30 days
      T_points: [
        [0, 1200],
        [2505600, 1000], // 29 days - slow cooling at depth
        [2548800, 900], // Then eruption
        [2592000, 25] // Rapid surface cooling
      ],
      P_points: [
        [0, 200],
        [2505600, 150], // At depth
        [2548800, 0.1], // Rapid decompression
        [2592000, 0.1]
      ]
    },
    environment: {
      emplacement: 'extrusive',
      system: 'open'
    }
  }
];
