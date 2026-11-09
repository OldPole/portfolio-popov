<script setup lang="ts">
const { locale } = useI18n();

useHead(() => ({ htmlAttrs: { lang: locale.value, dir: 'ltr' } }));
</script>

<template>
  <NuxtLayout><NuxtPage /></NuxtLayout>
</template>
