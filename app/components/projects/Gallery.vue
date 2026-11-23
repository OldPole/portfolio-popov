<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';

import type { ProjectImage } from '#shared/types/portfolio';

const props = defineProps<{ images: ProjectImage[] }>();

const { t } = useI18n();
const trackId = useId();
const track = useTemplateRef<HTMLDivElement>('track');
const activeIndex = ref(0);

function syncActiveIndex() {
  const viewport = track.value;

  if (!viewport?.clientWidth) {
    return;
  }

  const index = Math.round(viewport.scrollLeft / viewport.clientWidth);
  activeIndex.value = Math.max(0, Math.min(props.images.length - 1, index));
}

function step(direction: -1 | 1) {
  const viewport = track.value;
  const index = activeIndex.value + direction;

  if (!viewport || index < 0 || index >= props.images.length) {
    return;
  }

  viewport.scrollTo({ left: index * viewport.clientWidth });
}
</script>

<template>
  <section class="project-gallery" aria-labelledby="gallery-title">
    <div class="project-gallery-header">
      <h2 id="gallery-title">{{ t('projects.gallery') }}</h2>

      <div v-if="images.length > 1" class="project-gallery-controls">
        <UiButton
          variant="outline"
          size="icon"
          :aria-label="t('projects.previousScreenshot')"
          :aria-controls="trackId"
          :disabled="activeIndex === 0"
          @click="step(-1)"
        >
          <ChevronLeft :size="20" aria-hidden="true" />
        </UiButton>

        <span class="project-gallery-position" aria-live="polite">
          {{ activeIndex + 1 }} / {{ images.length }}
        </span>

        <UiButton
          variant="outline"
          size="icon"
          :aria-label="t('projects.nextScreenshot')"
          :aria-controls="trackId"
          :disabled="activeIndex === images.length - 1"
          @click="step(1)"
        >
          <ChevronRight :size="20" aria-hidden="true" />
        </UiButton>
      </div>
    </div>

    <div
      :id="trackId"
      ref="track"
      class="project-gallery-track"
      tabindex="0"
      @scroll.passive="syncActiveIndex"
      @keydown.left.prevent="step(-1)"
      @keydown.right.prevent="step(1)"
    >
      <div
        v-for="image in images"
        :key="image.src"
        class="project-gallery-slide"
      >
        <ProjectsScreenshot :image="image" />
      </div>
    </div>
  </section>
</template>
