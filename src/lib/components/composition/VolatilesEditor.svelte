<script lang="ts">
  import { scenario } from '$lib/stores/scenario';

  function handleH2OChange(value: string) {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      scenario.setH2O(num);
    }
  }
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
  <h2 class="text-lg font-semibold text-stone-200 mb-4">Volatiles</h2>

  <div class="space-y-4">
    <div>
      <div class="flex items-center justify-between mb-2">
        <label for="h2o" class="text-stone-400 text-sm font-medium">
          H2O (wt%)
        </label>
        <span class="text-sm font-mono text-stone-200">
          {$scenario.volatiles.H2O.toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        id="h2o"
        min="0"
        max="8"
        step="0.1"
        value={$scenario.volatiles.H2O}
        oninput={(e) => handleH2OChange(e.currentTarget.value)}
        class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div class="flex justify-between text-xs text-stone-500 mt-1">
        <span>Dry (0%)</span>
        <span>Saturated (~8%)</span>
      </div>
    </div>

    <div class="text-xs text-stone-500 bg-stone-800/50 rounded p-3">
      <p class="mb-1"><strong class="text-stone-400">Water affects:</strong></p>
      <ul class="list-disc list-inside space-y-0.5">
        <li>Liquidus temperature (lower with more H2O)</li>
        <li>Mineral stability (favors amphibole, biotite)</li>
        <li>Degassing and vesiculation potential</li>
      </ul>
    </div>
  </div>
</div>
