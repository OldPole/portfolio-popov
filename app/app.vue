<script setup lang="ts">
const { locale, t } = useI18n()
const head = useLocaleHead()
useHead(() => ({ htmlAttrs: { lang: locale.value }, link: head.value.link, meta: head.value.meta }))
useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => t('seo.title'),
  ogDescription: () => t('seo.description'),
  ogType: 'website',
  twitterCard: 'summary',
})
</script>

<template>
  <NuxtLayout><NuxtPage /></NuxtLayout>
</template>
