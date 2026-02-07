<script lang="ts">
  import type { PredictionResult, Scenario } from '$lib/engine/types';

  interface Props {
    result: PredictionResult;
    scenario: Scenario;
  }

  let { result, scenario }: Props = $props();

  let expanded = $state(false);
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg overflow-hidden">
  <button
    onclick={() => (expanded = !expanded)}
    class="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-stone-800/30 transition-colors"
  >
    <span class="text-lg font-semibold text-stone-200">Explainability</span>
    <span class="text-stone-400 transform transition-transform {expanded ? 'rotate-180' : ''}">
      ▼
    </span>
  </button>

  {#if expanded}
    <div class="px-5 pb-5 space-y-4">
      <!-- Confidence factors -->
      <div>
        <h3 class="text-sm font-medium text-stone-400 mb-2">Confidence Assessment</h3>
        <div class="bg-stone-800/30 rounded p-3 space-y-1">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full {result.confidence.level === 'high'
                ? 'bg-green-500'
                : result.confidence.level === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'}"
            ></span>
            <span class="text-sm text-stone-200 capitalize">{result.confidence.level}</span>
            <span class="text-xs text-stone-500">
              (score: {(result.confidence.score * 100).toFixed(0)}%)
            </span>
          </div>
          <ul class="text-xs text-stone-400 list-disc list-inside mt-2">
            {#each result.confidence.factors as factor}
              <li>{factor}</li>
            {/each}
          </ul>
        </div>
      </div>

      <!-- Input summary -->
      <div>
        <h3 class="text-sm font-medium text-stone-400 mb-2">Input Values Used</h3>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-stone-800/30 rounded p-2">
            <span class="text-stone-500">SiO2:</span>
            <span class="text-stone-300 font-mono ml-1"
              >{scenario.composition.SiO2.toFixed(1)}%</span
            >
          </div>
          <div class="bg-stone-800/30 rounded p-2">
            <span class="text-stone-500">Na2O+K2O:</span>
            <span class="text-stone-300 font-mono ml-1">
              {(scenario.composition.Na2O + scenario.composition.K2O).toFixed(1)}%
            </span>
          </div>
          <div class="bg-stone-800/30 rounded p-2">
            <span class="text-stone-500">H2O:</span>
            <span class="text-stone-300 font-mono ml-1">{scenario.volatiles.H2O.toFixed(1)}%</span>
          </div>
          <div class="bg-stone-800/30 rounded p-2">
            <span class="text-stone-500">Emplacement:</span>
            <span class="text-stone-300 ml-1">{scenario.environment.emplacement}</span>
          </div>
          <div class="bg-stone-800/30 rounded p-2">
            <span class="text-stone-500">System:</span>
            <span class="text-stone-300 ml-1">{scenario.environment.system}</span>
          </div>
          <div class="bg-stone-800/30 rounded p-2">
            <span class="text-stone-500">Duration:</span>
            <span class="text-stone-300 font-mono ml-1">
              {#if scenario.path.t_end_s < 3600}
                {(scenario.path.t_end_s / 60).toFixed(0)}m
              {:else if scenario.path.t_end_s < 86400}
                {(scenario.path.t_end_s / 3600).toFixed(1)}h
              {:else if scenario.path.t_end_s < 31536000}
                {(scenario.path.t_end_s / 86400).toFixed(1)}d
              {:else}
                {(scenario.path.t_end_s / 31536000).toFixed(1)}y
              {/if}
            </span>
          </div>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="bg-yellow-900/20 border border-yellow-800/50 rounded p-3">
        <p class="text-xs text-yellow-300/80">
          <strong>Note:</strong> This is an educational tool using simplified heuristic rules. Results
          are approximate and should not be used for research-grade predictions. Real igneous petrology
          involves complex thermodynamic modeling (e.g., MELTS) and field observations.
        </p>
      </div>
    </div>
  {/if}
</div>
