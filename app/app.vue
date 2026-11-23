<script setup lang="ts">
const { locale } = useI18n();

useHead(() => ({
  htmlAttrs: { lang: locale.value, dir: 'ltr' },
  link:
    locale.value === 'ru'
      ? [
          {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: '/fonts/manrope-cyrillic.woff2',
            crossorigin: 'anonymous',
          },
        ]
      : [],
}));
</script>

<template>
  <NuxtLayout><NuxtPage /></NuxtLayout>
</template>
