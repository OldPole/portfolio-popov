<script setup lang="ts">
import { Menu, Moon, Sun, X } from '@lucide/vue';

import { usePortfolioLocale } from '~/composables/usePortfolioLocale';
import { usePortfolioProfile } from '~/composables/usePortfolioProfile';

const { t, locale } = useI18n();
const lang = usePortfolioLocale();
const profile = usePortfolioProfile();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();
const homePath = computed(() => localePath('/'));
const colorMode = useColorMode();

const menuOpen = ref(false);
const mounted = ref(false);

const otherLocale = computed(() => (locale.value === 'en' ? 'ru' : 'en'));
const languagePath = computed(() => {
  const path = switchLocalePath(otherLocale.value);

  return mounted.value ? path : path.replace(/#.*$/, '');
});
const links = computed(() => [
  { label: t('nav.experience'), href: `${homePath.value}#experience` },
  { label: t('nav.skills'), href: `${homePath.value}#skills` },
  { label: t('nav.projects'), href: `${homePath.value}#projects` },
]);

onMounted(() => {
  mounted.value = true;
});

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
    <div class="container header-inner">
      <NuxtLink
        :to="homePath"
        class="wordmark"
        :aria-label="`${profile.name[lang]} — ${t('nav.home')}`"
      >
        {{ profile.wordmark }}
      </NuxtLink>
      <nav class="desktop-nav" :aria-label="t('common.navigation')">
        <a v-for="link in links" :key="link.href" :href="link.href">
          {{ link.label }}
        </a>
      </nav>

      <div class="header-actions">
        <UiButton
          :to="languagePath"
          variant="ghost"
          size="icon"
          class="language-toggle"
          :aria-label="`${otherLocale.toUpperCase()} — ${t('common.language')}`"
        >
          {{ otherLocale.toUpperCase() }}
        </UiButton>

        <UiButton
          variant="ghost"
          size="icon"
          class="theme-toggle"
          :aria-label="t('common.toggleTheme')"
          @click="
            colorMode.preference =
              colorMode.value === 'light' ? 'dark' : 'light'
          "
        >
          <Sun class="theme-icon-sun" :size="17" aria-hidden="true" />
          <Moon class="theme-icon-moon" :size="17" aria-hidden="true" />
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
    </div>

    <nav
      v-if="menuOpen"
      id="mobile-navigation"
      class="mobile-nav"
      :aria-label="t('common.navigation')"
      @keydown.esc="menuOpen = false"
    >
      <div class="container mobile-nav-links">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </a>
        <a :href="`${homePath}#contact`" @click="menuOpen = false">
          {{ t('nav.contact') }}
        </a>
      </div>
    </nav>
  </header>
</template>
