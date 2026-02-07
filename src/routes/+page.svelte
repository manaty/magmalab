<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>MagmaLab - Magma to Rock Playground</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-[70vh] text-center">
  <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
    MagmaLab
  </h1>
  <p class="text-xl text-stone-400 mb-2">Magma to Rock Playground</p>
  <p class="text-stone-500 max-w-xl mb-8">
    Explore how magma composition and cooling history determine rock type,
    mineral assemblage, and texture. An interactive educational tool for
    understanding igneous petrology.
  </p>

  <div class="flex flex-col sm:flex-row gap-4">
    <button
      onclick={() => goto('/build')}
      class="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-lg font-semibold text-white transition-all shadow-lg shadow-red-900/30"
    >
      Start Building
    </button>
    <button
      onclick={() => goto('/build?preset=morb')}
      class="px-8 py-3 bg-stone-800 hover:bg-stone-700 rounded-lg font-semibold text-stone-200 transition-all border border-stone-700"
    >
      Try MORB Preset
    </button>
  </div>

  <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
    <div class="bg-stone-900/50 border border-stone-800 rounded-lg p-5">
      <div class="text-2xl mb-2">1</div>
      <h3 class="font-semibold text-stone-200 mb-1">Build Magma</h3>
      <p class="text-sm text-stone-500">Set composition and volatiles</p>
    </div>
    <div class="bg-stone-900/50 border border-stone-800 rounded-lg p-5">
      <div class="text-2xl mb-2">2</div>
      <h3 class="font-semibold text-stone-200 mb-1">Set Path</h3>
      <p class="text-sm text-stone-500">Define cooling and pressure history</p>
    </div>
    <div class="bg-stone-900/50 border border-stone-800 rounded-lg p-5">
      <div class="text-2xl mb-2">3</div>
      <h3 class="font-semibold text-stone-200 mb-1">See Results</h3>
      <p class="text-sm text-stone-500">Get rock name, minerals, texture</p>
    </div>
  </div>
</div>
