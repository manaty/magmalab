<script lang="ts">
  import { scenario, compositionTotal } from '$lib/stores/scenario';
  import type { Composition } from '$lib/engine/types';

  const oxides: { key: keyof Composition; label: string; min: number; max: number }[] = [
    { key: 'SiO2', label: 'SiO2', min: 35, max: 80 },
    { key: 'TiO2', label: 'TiO2', min: 0, max: 5 },
    { key: 'Al2O3', label: 'Al2O3', min: 5, max: 25 },
    { key: 'FeOt', label: 'FeO*', min: 0, max: 20 },
    { key: 'MnO', label: 'MnO', min: 0, max: 1 },
    { key: 'MgO', label: 'MgO', min: 0, max: 20 },
    { key: 'CaO', label: 'CaO', min: 0, max: 15 },
    { key: 'Na2O', label: 'Na2O', min: 0, max: 10 },
    { key: 'K2O', label: 'K2O', min: 0, max: 10 },
    { key: 'P2O5', label: 'P2O5', min: 0, max: 2 }
  ];

  function handleOxideChange(key: keyof Composition, value: string) {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      scenario.setOxide(key, num);
    }
  }

  function normalizeComposition() {
    const total = $compositionTotal;
    if (total <= 0) return;

    const factor = 100 / total;
    const normalized: Composition = {
      SiO2: $scenario.composition.SiO2 * factor,
      TiO2: $scenario.composition.TiO2 * factor,
      Al2O3: $scenario.composition.Al2O3 * factor,
      FeOt: $scenario.composition.FeOt * factor,
      MnO: $scenario.composition.MnO * factor,
      MgO: $scenario.composition.MgO * factor,
      CaO: $scenario.composition.CaO * factor,
      Na2O: $scenario.composition.Na2O * factor,
      K2O: $scenario.composition.K2O * factor,
      P2O5: $scenario.composition.P2O5 * factor
    };
    scenario.setComposition(normalized);
  }
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-semibold text-stone-200">Major Oxides (wt%)</h2>
    <button
      onclick={normalizeComposition}
      class="px-3 py-1 text-sm bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 text-stone-300 transition-colors"
    >
      Normalize to 100%
    </button>
  </div>

  <div class="grid gap-3">
    {#each oxides as oxide}
      <div class="grid grid-cols-[80px_1fr_80px] gap-3 items-center">
        <label for={oxide.key} class="text-stone-400 text-sm font-medium">
          {oxide.label}
        </label>
        <input
          type="range"
          id="{oxide.key}-slider"
          min={oxide.min}
          max={oxide.max}
          step="0.1"
          value={$scenario.composition[oxide.key]}
          oninput={(e) => handleOxideChange(oxide.key, e.currentTarget.value)}
          class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-red-500"
        />
        <input
          type="number"
          id={oxide.key}
          min="0"
          max="100"
          step="0.1"
          value={$scenario.composition[oxide.key].toFixed(1)}
          onchange={(e) => handleOxideChange(oxide.key, e.currentTarget.value)}
          class="w-20 px-2 py-1 bg-stone-800 border border-stone-700 rounded text-right text-sm font-mono text-stone-200 focus:border-red-500 focus:outline-none"
        />
      </div>
    {/each}
  </div>

  <div class="mt-4 pt-4 border-t border-stone-700">
    <div class="flex items-center justify-between text-sm">
      <span class="text-stone-400">Total:</span>
      <span
        class="font-mono font-medium {Math.abs($compositionTotal - 100) < 0.5
          ? 'text-green-400'
          : Math.abs($compositionTotal - 100) < 2
            ? 'text-yellow-400'
            : 'text-red-400'}"
      >
        {$compositionTotal.toFixed(2)}%
      </span>
    </div>
    {#if Math.abs($compositionTotal - 100) >= 0.5}
      <p class="text-xs text-stone-500 mt-1">
        Click "Normalize" to adjust all values proportionally to total 100%
      </p>
    {/if}
  </div>
</div>
