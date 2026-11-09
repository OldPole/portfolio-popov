<script setup lang="ts">
import { usePortfolioSeo } from '~/composables/usePortfolioSeo'

const { t } = useI18n()

usePortfolioSeo({
  title: () => `${t('projects.title')} — ${t('seo.name')}`,
  description: () => t('seo.projects'),
})
</script>

<template>
  <div class="standalone-page">
    <SectionsProjects heading-tag="h1" />
  </div>
</template>
