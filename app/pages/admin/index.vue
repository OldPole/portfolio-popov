<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue';
import '~/assets/css/admin.css';

definePageMeta({ layout: false });
useSeoMeta({ title: 'Админка портфолио', robots: 'noindex, nofollow' });

const route = useRoute();
const {
  data: session,
  error,
  refresh,
} = await useFetch('/api/admin/auth/session');
const logoutError = ref('');

const loginMessages: Record<string, string> = {
  cancelled: 'Вход отменён или ссылка устарела. Попробуй ещё раз.',
  forbidden: 'Вход доступен только для аккаунта OldPole.',
  error: 'GitHub не завершил вход. Попробуй ещё раз.',
};
const loginMessage = computed(
  () => loginMessages[String(route.query.auth || '')],
);

async function logout() {
  logoutError.value = '';

  try {
    await $fetch('/api/admin/auth/logout', { method: 'POST' });
    await refresh();
  } catch {
    logoutError.value = 'Не удалось завершить сессию. Попробуй ещё раз.';
  }
}
</script>

<template>
  <p v-if="logoutError" role="alert" class="admin-notice admin-error">
    {{ logoutError }}
  </p>
  <AdminWorkspace v-if="session?.user" :user="session.user" @logout="logout" />
  <main v-else class="admin-login">
    <div class="admin-login-card">
      <UiSocialIcon name="github" :size="30" aria-hidden="true" />
      <h1>Админка портфолио</h1>
      <p>Вход для владельца сайта через GitHub.</p>
      <p v-if="loginMessage || error" role="alert" class="admin-error">
        {{ loginMessage || 'Не удалось проверить вход. Обнови страницу.' }}
      </p>
      <UiButton v-if="session?.signInUrl" :href="session.signInUrl">
        Войти через GitHub
        <ArrowUpRight :size="17" aria-hidden="true" />
      </UiButton>
      <p v-else-if="!error" class="admin-hint">
        Для входа настрой GitHub OAuth App и добавь её Client ID и Client Secret
        в .env.
      </p>
      <UiButton href="/en" variant="text" size="small">
        Вернуться на сайт
      </UiButton>
    </div>
  </main>
</template>
