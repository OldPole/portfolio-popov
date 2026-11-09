<script setup lang="ts">
import { ArrowUpRight, Download, Menu, Moon, Sun, X } from '@lucide/vue'
import { profile } from '~/data/profile'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const colorMode = useColorMode()
const menuOpen = ref(false)
const otherLocale = computed(() => (locale.value === 'en' ? 'ru' : 'en'))
const isDark = computed(() => colorMode.value === 'dark')
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)
const links = computed(() => [
  { label: t('nav.experience'), to: `${localePath('/')}#experience` },
  { label: t('nav.projects'), to: `${localePath('/')}#projects` },
])
</script>

<template>
  <a href="#main-content" class="skip-link">{{ t('nav.skip') }}</a>
  <header class="site-header">
    <NuxtLink
      :to="localePath('/')"
      class="wordmark"
      :aria-label="`${profile.name} — ${t('nav.home')}`"
      >kirill popov<span>.</span></NuxtLink
    >
    <nav class="desktop-nav" :aria-label="t('common.navigation')">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
      <a :href="profile.cv" download class="nav-cv"
        >CV <Download :size="13" aria-hidden="true"
      /></a>
    </nav>
    <div class="header-actions">
      <NuxtLink
        :to="switchLocalePath(otherLocale)"
        class="language-toggle"
        :aria-label="t('common.language')"
        >{{ otherLocale.toUpperCase() }}</NuxtLink
      >
      <ClientOnly>
        <button
          class="icon-button theme-toggle"
          :aria-label="t(isDark ? 'common.light' : 'common.dark')"
          @click="colorMode.preference = isDark ? 'light' : 'dark'"
        >
          <Sun v-if="isDark" :size="17" aria-hidden="true" /><Moon
            v-else
            :size="17"
            aria-hidden="true"
          />
        </button>
        <template #fallback
          ><span class="icon-button"><Moon :size="17" aria-hidden="true" /></span
        ></template>
      </ClientOnly>
      <NuxtLink :to="`${localePath('/')}#contact`" class="button button-small header-contact"
        >{{ t('nav.contact') }} <ArrowUpRight :size="15" aria-hidden="true"
      /></NuxtLink>
      <button
        class="icon-button mobile-menu-toggle"
        :aria-label="t('nav.menu')"
        :aria-expanded="menuOpen"
        aria-controls="mobile-navigation"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" :size="21" aria-hidden="true" /><Menu
          v-else
          :size="21"
          aria-hidden="true"
        />
      </button>
    </div>
    <nav
      v-if="menuOpen"
      id="mobile-navigation"
      class="mobile-nav"
      :aria-label="t('common.navigation')"
      @keydown.esc="menuOpen = false"
    >
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" @click="menuOpen = false">{{
        link.label
      }}</NuxtLink>
      <a :href="profile.cv" download @click="menuOpen = false">{{ t('common.download') }}</a>
      <NuxtLink :to="`${localePath('/')}#contact`" @click="menuOpen = false">{{
        t('nav.contact')
      }}</NuxtLink>
    </nav>
  </header>
</template>
