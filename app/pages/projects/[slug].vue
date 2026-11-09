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
    <ProjectsScreenshot
      :image="{
        src: project.image,
        width: project.imageWidth,
        height: project.imageHeight,
        caption: project.imageCaption,
      }"
      :accent="project.accent"
      priority
    />
    <div class="project-body">
      <div>
        <div class="project-overview">
          <h2>{{ t('projects.overview') }}</h2>
          <p
            v-for="paragraph in project.overview[lang]"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
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
    <section
      class="project-implementation"
      aria-labelledby="implementation-title"
    >
      <h2 id="implementation-title">{{ t('projects.implementation') }}</h2>
      <div class="implementation-grid">
        <article
          v-for="detail in project.implementation[lang]"
          :key="detail.title"
        >
          <h3>{{ detail.title }}</h3>
          <p>{{ detail.body }}</p>
        </article>
      </div>
      <UiButton
        :href="`${project.repository}#readme`"
        target="_blank"
        rel="noopener noreferrer"
        variant="text"
        size="small"
        class="project-readme"
      >
        {{ t('projects.readme') }}
        <ArrowUpRight
          :size="14"
          aria-hidden="true"
        />
      </UiButton>
    </section>
    <section
      class="project-gallery"
      aria-labelledby="gallery-title"
    >
      <h2 id="gallery-title">{{ t('projects.gallery') }}</h2>
      <p class="project-gallery-intro">{{ t('projects.galleryIntro') }}</p>
      <div class="project-gallery-grid">
        <ProjectsScreenshot
          v-for="image in project.gallery"
          :key="image.src"
          :image="image"
        />
      </div>
    </section>
  </div>
</template>
