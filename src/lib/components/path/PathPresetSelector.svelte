<script lang="ts">
  import { scenario } from '$lib/stores/scenario';
  import { pathPresets } from '$lib/data/pathPresets';

  let selectedPreset = $state('');

  function applyPreset(presetId: string) {
    const preset = pathPresets.find((p) => p.id === presetId);
    if (preset) {
      scenario.setPath({
        t_end_s: preset.path.t_end_s,
        T_points: preset.path.T_points.map((p) => [...p] as [number, number]),
        P_points: preset.path.P_points.map((p) => [...p] as [number, number])
      });
      scenario.setEnvironment({ ...preset.environment });
      selectedPreset = presetId;
    }
  }
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
  <h2 class="text-lg font-semibold text-stone-200 mb-3">Path Presets</h2>

  <div class="space-y-2 max-h-80 overflow-y-auto">
    {#each pathPresets as preset}
      <button
        onclick={() => applyPreset(preset.id)}
        class="w-full text-left px-3 py-2 rounded-md border transition-colors
          {selectedPreset === preset.id
          ? 'bg-orange-900/30 border-orange-700 text-orange-200'
          : 'bg-stone-800/50 border-stone-700 hover:border-stone-600 text-stone-300'}"
      >
        <div class="font-medium">{preset.name}</div>
        <div class="text-xs text-stone-500">{preset.description}</div>
      </button>
    {/each}
  </div>
</div>
