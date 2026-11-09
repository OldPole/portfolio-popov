<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { profile } from '~/data/profile'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <footer class="site-footer container">
    <div class="footer-main">
      <div>
        <NuxtLink
          :to="localePath('/')"
          class="wordmark"
        >
          kirill popov
          <span>.</span>
        </NuxtLink>
        <p class="footer-description">{{ t('footer.description') }}</p>
      </div>
      <div class="footer-links">
        <span class="small-label">{{ t('common.navigation') }}</span>
        <NuxtLink :to="localePath('/experience')">{{ t('nav.experience') }}</NuxtLink>
        <NuxtLink :to="localePath('/projects')">{{ t('nav.projects') }}</NuxtLink>
        <NuxtLink :to="localePath('/contact')">{{ t('nav.contact') }}</NuxtLink>
        <a
          :href="profile.cv"
          download
        >
          {{ t('common.download') }}
        </a>
      </div>
      <div class="footer-links">
        <span class="small-label">{{ t('nav.contact') }}</span>
        <a :href="`mailto:${profile.email}`">
          {{ profile.email }}
          <ArrowUpRight
            :size="13"
            aria-hidden="true"
          />
        </a>
        <a
          :href="profile.linkedin"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
          <ArrowUpRight
            :size="13"
            aria-hidden="true"
          />
        </a>
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <ArrowUpRight
            :size="13"
            aria-hidden="true"
          />
        </a>
        <a
          :href="profile.telegram"
          target="_blank"
          rel="noopener noreferrer"
        >
          @OldPoleh
          <ArrowUpRight
            :size="13"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
