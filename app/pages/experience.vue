<script setup lang="ts">
import { usePortfolioSeo } from '~/composables/usePortfolioSeo'

const { t } = useI18n()

usePortfolioSeo({
  title: () => `${t('experience.title')} — ${t('seo.name')}`,
  description: () => t('seo.experience'),
})
</script>

<template>
  <div class="standalone-page">
    <SectionsExperience
      heading-tag="h1"
      :numbered="false"
    />
    <SectionsSkills :numbered="false" />
  </div>
</template>
