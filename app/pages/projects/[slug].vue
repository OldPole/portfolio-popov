<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from '@lucide/vue'
import { projects } from '#shared/data/projects'
import { usePortfolioLocale } from '~/composables/usePortfolioLocale'
import { usePortfolioSeo } from '~/composables/usePortfolioSeo'
const route = useRoute()
const { t } = useI18n()
const lang = usePortfolioLocale()
const localePath = useLocalePath()
const project = computed(() => projects.find((item) => item.slug === route.params.slug))
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}
usePortfolioSeo({
  title: () => `${project.value?.name} — Kirill Popov`,
  description: () => project.value?.description[lang.value] || '',
  image: () => project.value?.image || '/images/portfolio-social.jpg',
  imageWidth: () => project.value?.imageWidth || 1200,
  imageHeight: () => project.value?.imageHeight || 630,
})
</script>

<template>
  <div
    v-if="project"
    class="project-page container"
  >
    <UiButton
      :to="localePath('/projects')"
      variant="text"
      size="small"
      class="project-back"
    >
      <ArrowLeft
        :size="16"
        aria-hidden="true"
      />
      {{ t('common.back') }}
    </UiButton>
    <div class="project-page-heading">
      <p class="eyebrow">
        {{ project.category[lang] }}
        <span v-if="project.year">/ {{ project.year }}</span>
      </p>
      <h1>
        {{ project.name }}
        <span class="accent">.</span>
      </h1>
      <p class="project-lead">{{ project.description[lang] }}</p>
      <div class="project-page-actions">
        <UiButton
          :href="project.repository"
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <UiSocialIcon
            name="github"
            :size="16"
            aria-hidden="true"
          />
          {{ t('common.viewCode') }}
          <ArrowUpRight
            :size="15"
            aria-hidden="true"
          />
        </UiButton>
        <UiButton
          v-if="project.demo"
          :href="project.demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('common.liveDemo') }}
          <ExternalLink
            :size="16"
            aria-hidden="true"
          />
        </UiButton>
      </div>
    </div>
    <div
      class="project-detail-image"
      :style="{ background: project.accent }"
    >
      <NuxtImg
        :src="project.image"
        :alt="t('common.screenshot', { name: project.name })"
        :width="project.imageWidth"
        :height="project.imageHeight"
        sizes="sm:100vw lg:1200px"
        format="webp"
        preload
      />
    </div>
    <div class="project-body">
      <div>
        <p class="eyebrow">{{ t('projects.contribution') }}</p>
        <h2>{{ t('projects.contribution') }}</h2>
        <p>{{ project.contribution[lang] }}</p>
        <h3>{{ t('projects.highlights') }}</h3>
        <ul class="project-highlights">
          <li
            v-for="item in project.highlights[lang]"
            :key="item"
          >
            <Check
              :size="17"
              aria-hidden="true"
            />
            {{ item }}
          </li>
        </ul>
      </div>
      <aside v-if="project.stack.length">
        <p class="eyebrow">{{ t('projects.stack') }}</p>
        <div class="tag-list">
          <span
            v-for="item in project.stack"
            :key="item"
            class="tag skill-tag"
          >
            {{ item }}
          </span>
        </div>
      </aside>
    </div>
    <div
      v-for="image in project.gallery"
      :key="image.src"
      class="project-gallery-image"
    >
      <NuxtImg
        :src="image.src"
        :alt="t('common.screenshot', { name: project.name })"
        :width="image.width"
        :height="image.height"
        sizes="sm:100vw lg:1200px"
        format="webp"
        loading="lazy"
      />
    </div>
    <NuxtLink
      :to="localePath('/contact')"
      class="project-contact-link"
    >
      {{ t('nav.contact') }}
      <ArrowUpRight
        :size="24"
        aria-hidden="true"
      />
    </NuxtLink>
  </div>
</template>
