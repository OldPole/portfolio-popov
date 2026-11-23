<script setup lang="ts">
import type { PreviewContent } from '#shared/types/admin';
import { portfolioProfileKey } from '~/composables/usePortfolioProfile';

const props = defineProps<{ data: PreviewContent }>();

provide(
  portfolioProfileKey,
  computed(() => props.data.profile),
);
</script>

<template>
  <div class="site-shell">
    <LayoutSiteHeader />
    <main id="main-content" tabindex="-1">
      <ProjectsDetails v-if="data.project" :project="data.project" />
      <PortfolioHome v-else-if="data.home" :home="data.home" preview />
    </main>
    <LayoutSiteFooter />
  </div>
</template>
