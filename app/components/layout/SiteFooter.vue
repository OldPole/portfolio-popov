<script setup lang="ts">
import { ArrowUp, ArrowUpRight, MoveHorizontal } from '@lucide/vue'
import { profile } from '~/data/profile'
const { t } = useI18n()
const localePath = useLocalePath()
const reducedMotion = useCookie<boolean>('popov-reduced-motion', {
  default: () => false,
  sameSite: 'lax',
})
useHead(() => ({ htmlAttrs: { 'data-reduced-motion': String(reducedMotion.value) } }))
</script>

<template>
  <footer class="site-footer container">
    <div class="footer-main">
      <div>
        <NuxtLink :to="localePath('/')" class="wordmark">kirill popov<span>.</span></NuxtLink>
        <p class="footer-description">{{ t('footer.description') }}</p>
      </div>
      <div class="footer-links">
        <span class="small-label">{{ t('common.navigation') }}</span
        ><NuxtLink :to="`${localePath('/')}#experience`">{{ t('nav.experience') }}</NuxtLink
        ><NuxtLink :to="`${localePath('/')}#projects`">{{ t('nav.projects') }}</NuxtLink
        ><a :href="profile.cv" download>{{ t('common.download') }}</a>
      </div>
      <div class="footer-links">
        <span class="small-label">{{ t('nav.contact') }}</span
        ><a :href="`mailto:${profile.email}`">{{ profile.email }} <ArrowUpRight :size="13" /></a
        ><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer"
          >LinkedIn <ArrowUpRight :size="13" /></a
        ><a :href="profile.github" target="_blank" rel="noopener noreferrer"
          >GitHub <ArrowUpRight :size="13"
        /></a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>{{ t('footer.copyright', { year: new Date().getFullYear() }) }}</span
      ><span class="built-with">{{ t('footer.built') }}</span
      ><button
        class="motion-button"
        :aria-pressed="reducedMotion"
        @click="reducedMotion = !reducedMotion"
      >
        <MoveHorizontal :size="14" aria-hidden="true" />{{
          t(reducedMotion ? 'footer.motionOn' : 'footer.motion')
        }}</button
      ><a href="#main-content" class="icon-button" :aria-label="t('common.top')"
        ><ArrowUp :size="17"
      /></a>
    </div>
  </footer>
</template>
