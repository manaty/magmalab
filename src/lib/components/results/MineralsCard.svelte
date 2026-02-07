<script lang="ts">
  import type { MineralResult } from '$lib/engine/types';

  interface Props {
    minerals: MineralResult[];
  }

  let { minerals }: Props = $props();

  const primary = $derived(minerals.filter((m) => m.category === 'primary'));
  const accessory = $derived(minerals.filter((m) => m.category === 'accessory'));

  const likelihoodColors = {
    likely: 'bg-green-900/30 border-green-700 text-green-300',
    possible: 'bg-yellow-900/30 border-yellow-700 text-yellow-300',
    unlikely: 'bg-stone-800/30 border-stone-700 text-stone-400'
  };
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-5">
  <h2 class="text-lg font-semibold text-stone-200 mb-4">Mineral Assemblage</h2>

  {#if minerals.length === 0}
    <p class="text-stone-500">No minerals predicted</p>
  {:else}
    <div class="space-y-4">
      <!-- Primary minerals -->
      {#if primary.length > 0}
        <div>
          <h3 class="text-sm font-medium text-stone-400 mb-2">Primary Phases</h3>
          <div class="space-y-2">
            {#each primary as mineral}
              <div
                class="rounded border p-2 {likelihoodColors[mineral.likelihood]}"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{mineral.name}</span>
                  <span class="text-xs opacity-75">{mineral.likelihood}</span>
                </div>
                <p class="text-xs mt-1 opacity-75">{mineral.explanation}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Accessory minerals -->
      {#if accessory.length > 0}
        <div>
          <h3 class="text-sm font-medium text-stone-400 mb-2">Accessory Phases</h3>
          <div class="flex flex-wrap gap-2">
            {#each accessory as mineral}
              <span
                class="px-2 py-1 text-sm rounded border {likelihoodColors[mineral.likelihood]}"
                title={mineral.explanation}
              >
                {mineral.name}
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
