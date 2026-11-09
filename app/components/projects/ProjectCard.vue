<script setup lang="ts">
import { ArrowUpRight, ExternalLink } from '@lucide/vue'
import type { Project } from '#shared/types/portfolio'
import { usePortfolioLocale } from '~/composables/usePortfolioLocale'
withDefaults(defineProps<{ project: Project; index: number; headingTag?: 'h2' | 'h3' }>(), {
  headingTag: 'h3',
})
const { t } = useI18n()
const localePath = useLocalePath()
const lang = usePortfolioLocale()
</script>

<template>
  <article class="project-card">
    <NuxtLink
      :to="localePath(`/projects/${project.slug}`)"
      class="project-image-link"
      :style="{ '--project-accent': project.accent }"
      :aria-label="`${project.name} — ${t('common.details')}`"
    >
      <div class="project-browser">
        <div
          class="browser-chrome"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <i>{{ project.name }}</i>
        </div>
        <NuxtImg
          :src="project.image"
          :alt="t('common.screenshot', { name: project.name })"
          :width="project.imageWidth"
          :height="project.imageHeight"
          sizes="sm:100vw md:50vw lg:600px"
          loading="lazy"
          densities="1x 2x"
          quality="95"
          format="webp"
        />
      </div>
      <span
        class="project-hover-arrow"
        aria-hidden="true"
      >
        <ArrowUpRight :size="22" />
      </span>
    </NuxtLink>
    <div class="project-meta">
      <span>{{ String(index + 1).padStart(2, '0') }} / {{ project.category[lang] }}</span>
      <span>{{ project.year }}</span>
    </div>
    <component :is="headingTag">
      <NuxtLink :to="localePath(`/projects/${project.slug}`)">
        {{ project.name }}
        <ArrowUpRight
          :size="22"
          aria-hidden="true"
        />
      </NuxtLink>
    </component>
    <p class="project-description">{{ project.description[lang] }}</p>
    <div
      v-if="project.stack.length"
      class="tag-list project-tags"
    >
      <span
        v-for="tag in project.stack"
        :key="tag"
        class="tag tag-subtle"
      >
        {{ tag }}
      </span>
    </div>
    <div class="project-actions">
      <UiButton
        :to="localePath(`/projects/${project.slug}`)"
        variant="text"
        size="small"
      >
        {{ t('common.details') }}
        <ArrowUpRight
          :size="14"
          aria-hidden="true"
        />
      </UiButton>
      <UiButton
        :href="project.repository"
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
        size="icon"
        :aria-label="`${project.name}: ${t('common.viewCode')}`"
      >
        <UiSocialIcon
          name="github"
          :size="17"
          aria-hidden="true"
        />
      </UiButton>
      <UiButton
        v-if="project.demo"
        :href="project.demo"
        target="_blank"
        rel="noopener noreferrer"
        variant="text"
        size="small"
        class="demo-link"
      >
        {{ t('common.liveDemo') }}
        <ExternalLink
          :size="13"
          aria-hidden="true"
        />
      </UiButton>
    </div>
  </article>
</template>
