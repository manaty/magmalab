<script lang="ts">
  import { scenario } from '$lib/stores/scenario';
  import PathPresetSelector from '$lib/components/path/PathPresetSelector.svelte';
  import EnvironmentToggles from '$lib/components/path/EnvironmentToggles.svelte';
  import PathChart from '$lib/components/path/PathChart.svelte';
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>Set Path - MagmaLab</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-stone-100">Set P-T-t Path</h1>
      <p class="text-stone-400 mt-1">
        Define the cooling and decompression history of your magma
      </p>
    </div>
    <div class="flex gap-3">
      <button
        onclick={() => goto('/build')}
        class="px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-200 transition-all border border-stone-700"
      >
        Back
      </button>
      <button
        onclick={() => goto('/results')}
        class="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-lg font-semibold text-white transition-all"
      >
        Predict Rock
      </button>
    </div>
  </div>

  <div class="grid gap-6 lg:grid-cols-3">
    <div class="lg:col-span-2 space-y-6">
      <PathChart />
    </div>

    <div class="space-y-6">
      <PathPresetSelector />
      <EnvironmentToggles />

      <div class="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
        <h3 class="font-semibold text-stone-200 mb-3">Path Summary</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-stone-400">Duration</span>
            <span class="font-mono">
              {#if $scenario.path.t_end_s < 3600}
                {($scenario.path.t_end_s / 60).toFixed(0)} min
              {:else if $scenario.path.t_end_s < 86400}
                {($scenario.path.t_end_s / 3600).toFixed(1)} hours
              {:else if $scenario.path.t_end_s < 31536000}
                {($scenario.path.t_end_s / 86400).toFixed(1)} days
              {:else}
                {($scenario.path.t_end_s / 31536000).toFixed(1)} years
              {/if}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-400">Start T</span>
            <span class="font-mono">{$scenario.path.T_points[0]?.[1] ?? '-'}C</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-400">End T</span>
            <span class="font-mono">
              {$scenario.path.T_points[$scenario.path.T_points.length - 1]?.[1] ?? '-'}C
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-400">Start P</span>
            <span class="font-mono">{$scenario.path.P_points[0]?.[1] ?? '-'} MPa</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-400">Emplacement</span>
            <span class="capitalize">{$scenario.environment.emplacement}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-400">System</span>
            <span class="capitalize">{$scenario.environment.system}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
