<script setup lang="ts">
import { usePortfolioSeo } from '~/composables/usePortfolioSeo';

const { t } = useI18n();

usePortfolioSeo({
  title: () => `${t('nav.contact')} — ${t('seo.name')}`,
  description: () => t('seo.contact'),
});
</script>

<template>
  <div class="standalone-page">
    <SectionsContact heading-tag="h1" :numbered="false" />
  </div>
</template>
