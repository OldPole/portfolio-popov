<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue';

import { usePortfolioProfile } from '~/composables/usePortfolioProfile';

const { t } = useI18n();
const profile = usePortfolioProfile();
const localePath = useLocalePath();
const homePath = computed(() => localePath('/'));
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-main">
      <div>
        <NuxtLink :to="homePath" class="wordmark">
          {{ profile.wordmark }}
        </NuxtLink>
      </div>

      <div class="footer-links">
        <span class="small-label">{{ t('common.navigation') }}</span>
        <a :href="`${homePath}#experience`">{{ t('nav.experience') }}</a>
        <a :href="`${homePath}#skills`">{{ t('nav.skills') }}</a>
        <a :href="`${homePath}#projects`">{{ t('nav.projects') }}</a>
        <a :href="`${homePath}#contact`">{{ t('nav.contact') }}</a>
      </div>

      <div class="footer-links">
        <span class="small-label">{{ t('nav.contact') }}</span>
        <a :href="`mailto:${profile.email}`">
          {{ profile.email }}
          <ArrowUpRight :size="13" aria-hidden="true" />
        </a>
        <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer">
          LinkedIn
          <ArrowUpRight :size="13" aria-hidden="true" />
        </a>
        <a :href="profile.github" target="_blank" rel="noopener noreferrer">
          GitHub
          <ArrowUpRight :size="13" aria-hidden="true" />
        </a>
        <a :href="profile.telegram" target="_blank" rel="noopener noreferrer">
          {{ profile.telegramHandle }}
          <ArrowUpRight :size="13" aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
</template>
