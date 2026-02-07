<script lang="ts">
  import type { TimelineEvent } from '$lib/engine/types';

  interface Props {
    events: TimelineEvent[];
  }

  let { events }: Props = $props();
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-5">
  <h2 class="text-lg font-semibold text-stone-200 mb-4">Crystallization Timeline</h2>

  <div class="relative">
    <!-- Vertical line -->
    <div
      class="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-red-500 via-orange-500 to-stone-600"
    ></div>

    <div class="space-y-4">
      {#each events as event, i}
        <div class="relative pl-8">
          <!-- Dot -->
          <div
            class="absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2
              {i === 0
              ? 'bg-red-500 border-red-400'
              : i === events.length - 1
                ? 'bg-stone-500 border-stone-400'
                : 'bg-orange-500 border-orange-400'}"
          ></div>

          <div class="bg-stone-800/30 rounded p-3">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono text-stone-500">{event.timeDescription}</span>
              <span class="text-sm font-medium text-stone-200">{event.event}</span>
            </div>
            <p class="text-xs text-stone-400">{event.details}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
