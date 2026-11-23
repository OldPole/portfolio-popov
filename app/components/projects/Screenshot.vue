<script setup lang="ts">
import type { ProjectImage } from '#shared/types/portfolio';
import { usePortfolioLocale } from '~/composables/usePortfolioLocale';

withDefaults(
  defineProps<{ image: ProjectImage; accent?: string; priority?: boolean }>(),
  {
    accent: undefined,
    priority: false,
  },
);

const lang = usePortfolioLocale();
</script>

<template>
  <figure
    class="project-screenshot"
    :style="{
      '--screenshot-width': `${image.width}px`,
      '--screenshot-accent': accent,
    }"
  >
    <div class="screenshot-frame">
      <NuxtImg
        :src="image.src"
        :alt="image.caption[lang]"
        :width="image.width"
        :height="image.height"
        sizes="sm:100vw md:90vw lg:1200px"
        densities="1x 2x"
        quality="95"
        format="webp"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        :preload="priority"
      />
    </div>
    <figcaption class="screenshot-caption">
      {{ image.caption[lang] }}
    </figcaption>
  </figure>
</template>
