<script lang="ts">
  import { page } from '$app/stores';

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/build', label: 'Build Magma' },
    { href: '/path', label: 'Set Path' },
    { href: '/results', label: 'Results' }
  ];

  function isActive(href: string, pathname: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }
</script>

<nav class="border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm sticky top-0 z-50">
  <div class="container mx-auto px-4 max-w-6xl">
    <div class="flex items-center justify-between h-14">
      <a href="/" class="flex items-center gap-2 font-bold text-lg">
        <span class="text-red-500">Magma</span>
        <span class="text-stone-400">Lab</span>
      </a>

      <div class="flex items-center gap-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              {isActive(item.href, $page.url.pathname)
                ? 'bg-stone-800 text-white'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}"
          >
            {item.label}
          </a>
        {/each}
      </div>
    </div>
  </div>
</nav>
