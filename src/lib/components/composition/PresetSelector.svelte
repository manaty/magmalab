<script lang="ts">
  import { scenario } from '$lib/stores/scenario';
  import { compositionPresets } from '$lib/data/presets';

  let selectedPreset = $state('');

  function applyPreset(presetId: string) {
    const preset = compositionPresets.find((p) => p.id === presetId);
    if (preset) {
      scenario.setComposition({ ...preset.composition });
      scenario.setVolatiles({ ...preset.volatiles });
      selectedPreset = presetId;
    }
  }
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
  <h2 class="text-lg font-semibold text-stone-200 mb-3">Composition Presets</h2>

  <div class="space-y-2">
    {#each compositionPresets as preset}
      <button
        onclick={() => applyPreset(preset.id)}
        class="w-full text-left px-3 py-2 rounded-md border transition-colors
          {selectedPreset === preset.id
          ? 'bg-red-900/30 border-red-700 text-red-200'
          : 'bg-stone-800/50 border-stone-700 hover:border-stone-600 text-stone-300'}"
      >
        <div class="font-medium">{preset.name}</div>
        <div class="text-xs text-stone-500">{preset.description}</div>
      </button>
    {/each}
  </div>

  <div class="mt-4 pt-3 border-t border-stone-700">
    <button
      onclick={() => {
        scenario.reset();
        selectedPreset = '';
      }}
      class="w-full px-3 py-2 text-sm bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 text-stone-400 transition-colors"
    >
      Reset to Default
    </button>
  </div>
</div>
