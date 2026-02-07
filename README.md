# MagmaLab

An interactive Progressive Web App (PWA) for understanding how igneous rocks form from magma. Input magma composition and cooling history to predict rock type, mineral assemblage, and texture.

## Features

- **Composition Editor**: Set major oxide composition (SiO2, Al2O3, FeO, MgO, etc.) with presets for common magma types (MORB, arc andesite, rhyolite)
- **P-T-t Path Builder**: Define cooling and pressure history using presets or custom curves
- **Rock Classification**: TAS diagram-based classification with volcanic/intrusive naming
- **Mineral Prediction**: Heuristic-based mineral assemblage inference
- **Texture Prediction**: Estimate texture (glassy, aphanitic, phaneritic, porphyritic, vesicular) based on cooling rate
- **Crystallization Timeline**: Narrative description of the crystallization sequence
- **Share Scenarios**: Generate compressed URLs to share configurations
- **Offline Support**: PWA with service worker caching

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: SvelteKit 2 with TypeScript
- **Styling**: Tailwind CSS 4
- **Charting**: D3.js for P-T-t path visualization
- **Storage**: LocalForage (IndexedDB)
- **URL Compression**: lz-string
- **Testing**: Vitest

## Project Structure

```
src/
  lib/
    engine/          # Core prediction engine
      tas.ts         # TAS classification
      minerals.ts    # Mineral inference
      texture.ts     # Texture inference
      timeline.ts    # Crystallization timeline
    components/      # Svelte components
    stores/          # Svelte stores
    data/            # Presets and static data
  routes/
    /                # Landing page
    /build           # Composition editor
    /path            # P-T-t path editor
    /results         # Prediction results
```

## Scientific Notes

This is an **educational tool** using simplified heuristic rules inspired by igneous petrology principles. It is not a thermodynamic solver.

- Rock naming uses the IUGS TAS (Total Alkali-Silica) diagram
- Mineral assemblages are based on simplified composition-dependent rules
- Textures are estimated from cooling rate and environment
- Results should be interpreted as "likely outcomes" with uncertainty

For research-grade predictions, consider tools like MELTS or rhyolite-MELTS.

## License

MIT
