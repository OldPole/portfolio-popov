<script setup lang="ts">
import { ArrowUpRight, Download, Menu, Moon, Sun, X } from '@lucide/vue';

import { profile } from '~/data/profile';

const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();
const colorMode = useColorMode();

const menuOpen = ref(false);

const otherLocale = computed(() => (locale.value === 'en' ? 'ru' : 'en'));
const isDark = computed(() => colorMode.value === 'dark');
const links = computed(() => [
  { label: t('nav.experience'), to: localePath('/experience') },
  { label: t('nav.projects'), to: localePath('/projects') },
]);

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <a href="#main-content" class="skip-link">
    {{ t('nav.skip') }}
  </a>
  <header class="site-header">
    <NuxtLink
      :to="localePath('/')"
      class="wordmark"
      :aria-label="`${profile.name} — ${t('nav.home')}`"
    >
      kirill popov
      <span>.</span>
    </NuxtLink>
    <nav class="desktop-nav" :aria-label="t('common.navigation')">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to">
        {{ link.label }}
      </NuxtLink>
    </nav>

    <div class="header-actions">
      <UiButton
        :href="profile.cv"
        download
        variant="ghost"
        size="small"
        class="nav-cv"
      >
        CV
        <Download :size="13" aria-hidden="true" />
      </UiButton>

      <UiButton
        :to="switchLocalePath(otherLocale)"
        variant="ghost"
        size="icon"
        class="language-toggle"
        :aria-label="`${otherLocale.toUpperCase()} — ${t('common.language')}`"
      >
        {{ otherLocale.toUpperCase() }}
      </UiButton>

      <ClientOnly>
        <UiButton
          variant="ghost"
          size="icon"
          class="theme-toggle"
          :aria-label="t(isDark ? 'common.light' : 'common.dark')"
          @click="colorMode.preference = isDark ? 'light' : 'dark'"
        >
          <Sun v-if="isDark" :size="17" aria-hidden="true" />
          <Moon v-else :size="17" aria-hidden="true" />
        </UiButton>

        <template #fallback>
          <span class="button button-ghost button-icon" aria-hidden="true">
            <Moon :size="17" />
          </span>
        </template>
      </ClientOnly>

      <UiButton
        :to="localePath('/contact')"
        size="small"
        class="header-contact"
      >
        {{ t('nav.contact') }}
        <ArrowUpRight :size="15" aria-hidden="true" />
      </UiButton>

      <UiButton
        variant="ghost"
        size="icon"
        class="mobile-menu-toggle"
        :aria-label="t('nav.menu')"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" :size="21" aria-hidden="true" />
        <Menu v-else :size="21" aria-hidden="true" />
      </UiButton>
    </div>

    <nav
      v-if="menuOpen"
      id="mobile-navigation"
      class="mobile-nav"
      :aria-label="t('common.navigation')"
      @keydown.esc="menuOpen = false"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </NuxtLink>
      <NuxtLink :to="localePath('/contact')" @click="menuOpen = false">
        {{ t('nav.contact') }}
      </NuxtLink>
    </nav>
  </header>
</template>
