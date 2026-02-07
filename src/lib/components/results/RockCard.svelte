<script lang="ts">
  import type { TASResult, ConfidenceResult, TextureType } from '$lib/engine/types';
  import { scenario } from '$lib/stores/scenario';
  import RockImage from './RockImage.svelte';

  interface Props {
    result: TASResult;
    confidence: ConfidenceResult;
    texture?: TextureType;
  }

  let { result, confidence, texture }: Props = $props();

  const confidenceColors = {
    high: 'text-green-400 bg-green-900/30 border-green-700',
    medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
    low: 'text-red-400 bg-red-900/30 border-red-700'
  };
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-5">
  <div class="flex items-start justify-between mb-4">
    <h2 class="text-lg font-semibold text-stone-200">Rock Classification</h2>
    <span
      class="px-2 py-0.5 text-xs font-medium rounded border {confidenceColors[confidence.level]}"
    >
      {confidence.level} confidence
    </span>
  </div>

  <div class="flex gap-5">
    <!-- Rock image -->
    <div class="flex-shrink-0">
      <RockImage fieldCode={result.fieldCode} {texture} size={140} />
    </div>

    <div class="flex-1 space-y-3">
      <!-- Primary rock name -->
      <div>
        <div class="text-2xl font-bold text-white mb-0.5">
          {$scenario.environment.emplacement === 'extrusive'
            ? result.volcanicName
            : result.intrusiveName}
        </div>
        <div class="text-sm text-stone-400">
          {$scenario.environment.emplacement === 'extrusive' ? 'Volcanic rock' : 'Plutonic rock'}
        </div>
      </div>

      <!-- Equivalent name -->
      <div class="bg-stone-800/50 rounded p-2">
        <div class="text-xs text-stone-500 mb-0.5">
          {$scenario.environment.emplacement === 'extrusive' ? 'Intrusive' : 'Extrusive'} equivalent
        </div>
        <div class="font-medium text-stone-300 text-sm">
          {$scenario.environment.emplacement === 'extrusive'
            ? result.intrusiveName
            : result.volcanicName}
        </div>
      </div>

      <!-- TAS values -->
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="bg-stone-800/30 rounded p-1.5">
          <div class="text-stone-500 text-xs">SiO2</div>
          <div class="font-mono text-stone-200 text-sm">{result.sio2.toFixed(1)}%</div>
        </div>
        <div class="bg-stone-800/30 rounded p-1.5">
          <div class="text-stone-500 text-xs">Na2O + K2O</div>
          <div class="font-mono text-stone-200 text-sm">{result.totalAlkalis.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  </div>

  <!-- TAS field info -->
  <div class="text-xs text-stone-500 mt-3">
    TAS field: <span class="text-stone-400">{result.fieldCode}</span>
    {#if result.boundaryDistance < 2}
      <span class="text-yellow-500 ml-2">
        (near boundary - {result.boundaryDistance.toFixed(1)} units)
      </span>
    {/if}
  </div>
</div>
