<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();

const isRussian = computed(() => useRequestURL().pathname.startsWith('/ru'));
</script>

<template>
  <div class="error-page">
    <p class="eyebrow">{{ error.statusCode }}</p>
    <h1>
      {{
        isRussian ? 'Эта страница потерялась.' : 'This page took a wrong turn.'
      }}
    </h1>
    <p>
      {{
        isRussian
          ? 'Возможно, страница переместилась или её не существует.'
          : 'The page may have moved or does not exist.'
      }}
    </p>
    <UiButton :href="isRussian ? '/ru' : '/en'">
      {{ isRussian ? 'На главную' : 'Back to home' }} ↗
    </UiButton>
  </div>
</template>
