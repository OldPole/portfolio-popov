<script setup lang="ts">
import '~/assets/css/admin.css';

definePageMeta({ layout: false, key: route => route.fullPath });
useSeoMeta({ title: 'Предпросмотр портфолио', robots: 'noindex, nofollow' });

const route = useRoute();
const { data: preview, error } = await useFetch('/api/admin/preview', {
  query: { section: route.query.section, key: route.query.key },
});

if (error.value?.statusCode === 401) {
  await navigateTo('/admin');
} else if (error.value) {
  throw createError(error.value);
}
</script>

<template>
  <template v-if="preview">
    <div class="admin-preview-bar">
      <span>Предпросмотр сохранённой записи</span>
      <UiButton href="/admin" variant="outline" size="small">
        Открыть админку
      </UiButton>
    </div>
    <AdminPreview :data="preview" />
  </template>
</template>
