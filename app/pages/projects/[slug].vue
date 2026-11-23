<script setup lang="ts">
import { usePortfolioLocale } from '~/composables/usePortfolioLocale';
import { usePortfolioProfile } from '~/composables/usePortfolioProfile';
import { usePortfolioSeo } from '~/composables/usePortfolioSeo';

definePageMeta({ key: route => route.path });

const route = useRoute();
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
  <ProjectsDetails v-if="project" :project="project" />
</template>
