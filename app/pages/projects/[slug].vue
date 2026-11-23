<script setup lang="ts">
import { ArrowUpRight, Check, ExternalLink } from '@lucide/vue';

import { usePortfolioLocale } from '~/composables/usePortfolioLocale';
import { usePortfolioProfile } from '~/composables/usePortfolioProfile';
import { usePortfolioSeo } from '~/composables/usePortfolioSeo';

definePageMeta({ key: route => route.path });

const route = useRoute();
const { t } = useI18n();
const lang = usePortfolioLocale();
const profile = usePortfolioProfile();
const slug = String(route.params.slug);
const { data: project, error } = await useFetch(
  `/api/portfolio/projects/${encodeURIComponent(slug)}`,
);

if (!project.value || error.value) {
  const notFound = error.value?.statusCode === 404;

  throw createError({
    statusCode: notFound ? 404 : 503,
    statusMessage: notFound
      ? 'Project not found'
      : 'Portfolio content is temporarily unavailable',
    fatal: true,
  });
}

usePortfolioSeo({
  title: () => `${project.value?.name} — ${profile.value.name[lang.value]}`,
  description: () => project.value?.description[lang.value] || '',
  image: () => project.value?.image || '/images/portfolio-social.jpg',
  imageWidth: () => project.value?.imageWidth || 1200,
  imageHeight: () => project.value?.imageHeight || 630,
});
</script>

<template>
  <div v-if="project" class="project-page container">
    <div class="project-page-heading">
      <p class="eyebrow">
        {{ project.category[lang] }}
        <span v-if="project.year">/ {{ project.year }}</span>
      </p>
      <h1>{{ project.name }}</h1>
      <p class="project-lead">{{ project.description[lang] }}</p>
      <div class="project-page-actions">
        <UiButton
          :href="project.repository"
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <UiSocialIcon name="github" :size="16" aria-hidden="true" />
          {{ t('common.viewCode') }}
          <ArrowUpRight :size="15" aria-hidden="true" />
        </UiButton>

        <UiButton
          v-if="project.demo"
          :href="project.demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('common.liveDemo') }}
          <ExternalLink :size="16" aria-hidden="true" />
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
          <p v-for="paragraph in project.overview[lang]" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>

        <h2>{{ t('projects.contribution') }}</h2>
        <p>{{ project.contribution[lang] }}</p>
        <h3>{{ t('projects.highlights') }}</h3>
        <ul class="project-highlights">
          <li v-for="item in project.highlights[lang]" :key="item">
            <Check :size="17" aria-hidden="true" />
            {{ item }}
          </li>
        </ul>
      </div>

      <aside v-if="project.stack.length">
        <p class="eyebrow">{{ t('projects.stack') }}</p>
        <div class="tag-list">
          <span v-for="item in project.stack" :key="item" class="tag skill-tag">
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
    </section>

    <ProjectsGallery
      v-if="project.gallery.length"
      :key="project.slug"
      :images="project.gallery"
    />
  </div>
</template>
