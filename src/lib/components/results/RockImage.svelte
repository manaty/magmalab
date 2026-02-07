<script lang="ts">
  import { getRockImageInfo, generateRockSvg } from '$lib/data/rockImages';

  interface Props {
    fieldCode: string;
    texture?: string;
    size?: number;
  }

  let { fieldCode, texture, size = 256 }: Props = $props();

  // Get image info, preferring texture-specific image for certain textures
  const imageInfo = $derived(() => {
    // Use texture-specific image for glassy, vesicular, or porphyritic
    if (texture === 'glassy' || texture === 'vesicular' || texture === 'porphyritic') {
      return getRockImageInfo(texture);
    }
    return getRockImageInfo(fieldCode);
  });

  // Use real photo if available, otherwise generate SVG
  const imageSrc = $derived(imageInfo().photoPath ?? generateRockSvg(imageInfo(), size));
  const altText = $derived(imageInfo().description);
  const hasPhoto = $derived(!!imageInfo().photoPath);
</script>

<div class="relative overflow-hidden rounded-lg" style="width: {size}px; height: {size}px;">
  <img
    src={imageSrc}
    alt={altText}
    class="w-full h-full object-cover"
    width={size}
    height={size}
  />
  <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
  {#if hasPhoto}
    <div class="absolute bottom-1 right-1 text-[8px] text-white/50 bg-black/30 px-1 rounded">
      CC
    </div>
  {/if}
</div>
