<script lang="ts">
  import { scenario } from '$lib/stores/scenario';
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-4">
  <h2 class="text-lg font-semibold text-stone-200 mb-4">Environment</h2>

  <div class="space-y-4">
    <!-- Emplacement Toggle -->
    <div>
      <label class="text-sm text-stone-400 mb-2 block">Emplacement</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          onclick={() => scenario.setEmplacement('extrusive')}
          class="px-3 py-2 rounded-md border text-sm font-medium transition-colors
            {$scenario.environment.emplacement === 'extrusive'
            ? 'bg-red-900/40 border-red-700 text-red-200'
            : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-600'}"
        >
          Extrusive
        </button>
        <button
          onclick={() => scenario.setEmplacement('intrusive')}
          class="px-3 py-2 rounded-md border text-sm font-medium transition-colors
            {$scenario.environment.emplacement === 'intrusive'
            ? 'bg-stone-700 border-stone-500 text-stone-200'
            : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-600'}"
        >
          Intrusive
        </button>
      </div>
      <p class="text-xs text-stone-500 mt-1">
        {$scenario.environment.emplacement === 'extrusive'
          ? 'Volcanic: erupted at surface'
          : 'Plutonic: crystallized at depth'}
      </p>
    </div>

    <!-- System Toggle -->
    <div>
      <label class="text-sm text-stone-400 mb-2 block">System Type</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          onclick={() => scenario.setSystemType('open')}
          class="px-3 py-2 rounded-md border text-sm font-medium transition-colors
            {$scenario.environment.system === 'open'
            ? 'bg-blue-900/40 border-blue-700 text-blue-200'
            : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-600'}"
        >
          Open
        </button>
        <button
          onclick={() => scenario.setSystemType('closed')}
          class="px-3 py-2 rounded-md border text-sm font-medium transition-colors
            {$scenario.environment.system === 'closed'
            ? 'bg-stone-700 border-stone-500 text-stone-200'
            : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-600'}"
        >
          Closed
        </button>
      </div>
      <p class="text-xs text-stone-500 mt-1">
        {$scenario.environment.system === 'open'
          ? 'Degassing allowed - volatiles can escape'
          : 'No degassing - volatiles remain dissolved'}
      </p>
    </div>
  </div>
</div>
