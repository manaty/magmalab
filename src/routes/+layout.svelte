<script lang="ts">
  import '../app.css';
  import Navigation from '$lib/components/Navigation.svelte';

  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
  <Navigation />
  <main class="flex-1 container mx-auto px-4 py-6 max-w-6xl">
    {@render children()}
  </main>
  <footer class="border-t border-stone-800 py-4 text-center text-sm text-stone-500">
    MagmaLab - An educational tool for understanding igneous petrology
  </footer>
</div>
