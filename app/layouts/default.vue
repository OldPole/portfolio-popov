<script setup lang="ts">
import { portfolioProfileKey } from '~/composables/usePortfolioProfile';

const { data, error } = await useFetch('/api/portfolio/profile');

if (!data.value || error.value) {
  throw createError({
    statusCode: 503,
    statusMessage: 'Portfolio content is temporarily unavailable',
    fatal: true,
  });
}

const profile = computed(() => data.value!);

provide(portfolioProfileKey, profile);
</script>

<template>
  <div class="site-shell">
    <LayoutSiteHeader />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <LayoutSiteFooter />
  </div>
</template>
