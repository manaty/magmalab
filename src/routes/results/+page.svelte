<script lang="ts">
  import { onMount } from 'svelte';
  import { scenario, predictionResult, isPredicting } from '$lib/stores/scenario';
  import { predict } from '$lib/engine';
  import RockCard from '$lib/components/results/RockCard.svelte';
  import MineralsCard from '$lib/components/results/MineralsCard.svelte';
  import TextureCard from '$lib/components/results/TextureCard.svelte';
  import TimelineView from '$lib/components/results/TimelineView.svelte';
  import ExplainPanel from '$lib/components/results/ExplainPanel.svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    runPrediction();
  });

  async function runPrediction() {
    isPredicting.set(true);
    try {
      const result = predict($scenario);
      predictionResult.set(result);
    } finally {
      isPredicting.set(false);
    }
  }
</script>

<svelte:head>
  <title>Results - MagmaLab</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-stone-100">Prediction Results</h1>
      <p class="text-stone-400 mt-1">
        Based on your magma composition and cooling history
      </p>
    </div>
    <div class="flex gap-3">
      <button
        onclick={() => goto('/path')}
        class="px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-200 transition-all border border-stone-700"
      >
        Modify Path
      </button>
      <button
        onclick={runPrediction}
        disabled={$isPredicting}
        class="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
      >
        {$isPredicting ? 'Predicting...' : 'Re-predict'}
      </button>
    </div>
  </div>

  {#if $isPredicting}
    <div class="flex items-center justify-center py-20">
      <div class="text-stone-400">Computing prediction...</div>
    </div>
  {:else if $predictionResult}
    <div class="grid gap-6 lg:grid-cols-2">
      <RockCard result={$predictionResult.tas} confidence={$predictionResult.confidence} texture={$predictionResult.texture.texture} />
      <MineralsCard minerals={$predictionResult.minerals} />
      <TextureCard texture={$predictionResult.texture} />
      <TimelineView events={$predictionResult.timeline} />
    </div>

    <ExplainPanel result={$predictionResult} scenario={$scenario} />
  {:else}
    <div class="flex items-center justify-center py-20">
      <div class="text-stone-400">No prediction available. Configure your scenario first.</div>
    </div>
  {/if}
</div>
