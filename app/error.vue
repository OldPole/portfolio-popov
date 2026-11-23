<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const isRussian = computed(() => useRequestURL().pathname.startsWith('/ru'));
const unavailable = computed(() => props.error.statusCode === 503);

const messages = {
  en: {
    missingTitle: 'This page took a wrong turn.',
    missingDescription: 'The page may have moved or does not exist.',
    unavailableTitle: 'The site is temporarily unavailable.',
    unavailableDescription: 'Please try again in a moment.',
  },
  ru: {
    missingTitle: 'Эта страница потерялась.',
    missingDescription:
      'Возможно, страница переместилась или её не существует.',
    unavailableTitle: 'Сайт временно недоступен.',
    unavailableDescription: 'Попробуйте открыть страницу чуть позже.',
  },
};

const copy = computed(() => messages[isRussian.value ? 'ru' : 'en']);
</script>

<template>
  <div class="error-page">
    <p class="eyebrow">{{ error.statusCode }}</p>
    <h1>{{ unavailable ? copy.unavailableTitle : copy.missingTitle }}</h1>
    <p>
      {{ unavailable ? copy.unavailableDescription : copy.missingDescription }}
    </p>
    <UiButton :href="isRussian ? '/ru' : '/en'">
      {{ isRussian ? 'На главную' : 'Back to home' }} ↗
    </UiButton>
  </div>
</template>
