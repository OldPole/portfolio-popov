<script setup lang="ts">
import { Expand } from '@lucide/vue';

import type { ProjectImage } from '#shared/types/portfolio';
import { usePortfolioLocale } from '~/composables/usePortfolioLocale';

withDefaults(
  defineProps<{ image: ProjectImage; accent?: string; priority?: boolean }>(),
  {
    accent: undefined,
    priority: false,
  },
);

const { t } = useI18n();
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
    <a
      :href="image.src"
      target="_blank"
      rel="noopener noreferrer"
      class="screenshot-frame"
      :aria-label="`${image.caption[lang]} — ${t('projects.openOriginal')}`"
    >
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
    </a>
    <figcaption class="screenshot-caption">
      <span>{{ image.caption[lang] }}</span>
      <UiButton
        :href="image.src"
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
        size="small"
      >
        {{ t('projects.openOriginal') }}
        <Expand :size="14" aria-hidden="true" />
      </UiButton>
    </figcaption>
  </figure>
</template>
