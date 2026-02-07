<script lang="ts">
  import type { TextureResult } from '$lib/engine/types';

  interface Props {
    texture: TextureResult;
  }

  let { texture }: Props = $props();

  const textureIcons: Record<string, string> = {
    glassy: '🔮',
    aphanitic: '🪨',
    phaneritic: '💎',
    porphyritic: '🎯',
    vesicular: '🫧'
  };
</script>

<div class="bg-stone-900/50 border border-stone-800 rounded-lg p-5">
  <h2 class="text-lg font-semibold text-stone-200 mb-4">Texture</h2>

  <div class="space-y-4">
    <!-- Main texture -->
    <div class="flex items-center gap-3">
      <span class="text-3xl">{textureIcons[texture.texture] ?? '🪨'}</span>
      <div>
        <div class="text-xl font-bold text-white capitalize">{texture.texture}</div>
        <div class="text-sm text-stone-400">{texture.description}</div>
      </div>
    </div>

    <!-- Explanation -->
    <div class="bg-stone-800/50 rounded p-3">
      <div class="text-xs text-stone-500 mb-1">Why this texture?</div>
      <p class="text-sm text-stone-300">{texture.explanation}</p>
    </div>

    <!-- Glass fraction -->
    {#if texture.glassFraction > 0.01}
      <div class="space-y-1">
        <div class="flex justify-between text-sm">
          <span class="text-stone-400">Glass content</span>
          <span class="text-stone-200">{(texture.glassFraction * 100).toFixed(0)}%</span>
        </div>
        <div class="h-2 bg-stone-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all"
            style="width: {texture.glassFraction * 100}%"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-stone-500">
          <span>Crystalline</span>
          <span>Glassy</span>
        </div>
      </div>
    {/if}
  </div>
</div>
