<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';

import type { ProjectImage } from '#shared/types/portfolio';
import { usePortfolioLocale } from '~/composables/usePortfolioLocale';

const props = defineProps<{ images: ProjectImage[] }>();

const { t } = useI18n();
const lang = usePortfolioLocale();
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

function goTo(index: number, behavior: ScrollBehavior = 'auto') {
  const viewport = track.value;

  if (!viewport || index < 0 || index >= props.images.length) {
    return;
  }

  viewport.scrollTo({ left: index * viewport.clientWidth, behavior });
}

function step(direction: -1 | 1) {
  goTo(activeIndex.value + direction);
}
</script>

<template>
  <section class="project-gallery" aria-labelledby="gallery-title">
    <h2 id="gallery-title">{{ t('projects.gallery') }}</h2>

    <div
      class="project-gallery-layout"
      :class="{ 'has-previews': images.length > 1 }"
    >
      <div class="project-gallery-main">
        <div class="project-gallery-stage">
          <div
            :id="trackId"
            ref="track"
            class="project-gallery-track"
            role="group"
            aria-labelledby="gallery-title"
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
              <ProjectsScreenshot :image="image" :show-caption="false" />
            </div>
          </div>

          <UiButton
            v-if="images.length > 1"
            class="project-gallery-arrow project-gallery-arrow-previous"
            variant="outline"
            size="icon"
            :aria-label="t('projects.previousScreenshot')"
            :aria-controls="trackId"
            :disabled="activeIndex === 0"
            @click="step(-1)"
          >
            <ChevronLeft :size="20" aria-hidden="true" />
          </UiButton>

          <UiButton
            v-if="images.length > 1"
            class="project-gallery-arrow project-gallery-arrow-next"
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

        <div class="project-gallery-caption" aria-live="polite">
          <p>{{ images[activeIndex]?.caption[lang] }}</p>
          <span v-if="images.length > 1" class="project-gallery-position">
            {{ activeIndex + 1 }} / {{ images.length }}
          </span>
        </div>
      </div>

      <div
        v-if="images.length > 1"
        class="project-gallery-previews"
        role="group"
        :aria-label="t('projects.screenshotPreviews')"
      >
        <UiButton
          v-for="(image, index) in images"
          :key="image.src"
          class="project-gallery-thumb"
          variant="outline"
          size="small"
          :aria-label="
            t('projects.showScreenshot', {
              number: index + 1,
              name: image.caption[lang],
            })
          "
          :aria-controls="trackId"
          :aria-pressed="activeIndex === index"
          @click="goTo(index, 'instant')"
        >
          <NuxtImg
            :src="image.src"
            :provider="image.src.startsWith('/media/') ? 'none' : undefined"
            :width="image.width"
            :height="image.height"
            sizes="144px"
            format="webp"
            quality="78"
            loading="lazy"
            alt=""
          />
        </UiButton>
      </div>
    </div>
  </section>
</template>
