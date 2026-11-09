<script setup lang="ts">
import { ArrowDown, ArrowUpRight, Download, MapPin } from '@lucide/vue'
import { profile } from '~/data/profile'
const { t } = useI18n()
</script>

<template>
  <section class="hero-panel" aria-labelledby="hero-title">
    <div class="container hero-inner">
      <div class="hero-topline">
        <span class="small-label">{{ t('hero.index') }}</span
        ><span class="location"
          ><MapPin :size="12" aria-hidden="true" />{{ t('hero.location') }}</span
        >
      </div>
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="hero-greeting"><span class="hello-dot" />{{ t('hero.eyebrow') }}</p>
          <h1 id="hero-title">{{ t('hero.title') }}<span class="accent">.</span></h1>
          <p class="hero-subtitle">{{ t('hero.subtitle') }}</p>
          <p class="hero-description">{{ t('hero.description') }}</p>
          <p class="hero-description secondary-description">{{ t('hero.description2') }}</p>
          <div class="hero-buttons">
            <a href="#projects" class="button"
              >{{ t('hero.work') }}<ArrowUpRight :size="17" aria-hidden="true" /></a
            ><a :href="profile.cv" download class="button button-outline"
              >{{ t('common.download') }}<Download :size="16" aria-hidden="true"
            /></a>
          </div>
        </div>
        <aside class="hero-aside">
          <figure class="hero-portrait">
            <NuxtImg
              src="/images/kirill-popov.webp"
              :alt="t('hero.portrait')"
              width="768"
              height="1026"
              sizes="140px sm:190px md:260px xl:290px"
              format="webp"
              quality="84"
              loading="eager"
              fetchpriority="high"
              preload
            />
          </figure>
          <div class="identity-row">
            <span>{{ t('hero.focus') }}</span
            ><strong>{{ t('hero.focusValue') }}</strong>
          </div>
          <div class="identity-row">
            <span>{{ t('hero.approach') }}</span
            ><strong>{{ t('hero.approachValue') }}</strong>
          </div>
          <div class="hero-socials">
            <a :href="profile.github" target="_blank" rel="noopener noreferrer"
              ><UiSocialIcon name="github" :size="15" aria-hidden="true" />GitHub
              <ArrowUpRight :size="13" aria-hidden="true" /></a
            ><a :href="profile.linkedin" target="_blank" rel="noopener noreferrer"
              ><UiSocialIcon name="linkedin" :size="15" aria-hidden="true" />LinkedIn
              <ArrowUpRight :size="13" aria-hidden="true"
            /></a>
          </div>
        </aside>
      </div>
      <a class="hero-scroll" href="#experience"
        ><ArrowDown :size="14" aria-hidden="true" />{{ t('hero.scroll') }}</a
      >
    </div>
  </section>
</template>
