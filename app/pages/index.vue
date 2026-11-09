<script setup lang="ts">
import { usePortfolioSeo } from '~/composables/usePortfolioSeo'
import { profile } from '~/data/profile'
import { siteOrigin } from '#shared/utils/site-origin'
const { t } = useI18n()
const config = useRuntimeConfig()
usePortfolioSeo({ title: () => t('seo.title'), description: () => t('seo.description') })
useHead(() => {
  const origin = siteOrigin(config.public.siteUrl)
  return {
    script: [
      {
        key: 'person-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          alternateName: 'Кирилл Попов',
          jobTitle: 'Frontend Developer',
          ...(origin ? { url: `${origin}/en`, image: `${origin}/images/kirill-popov.webp` } : {}),
          sameAs: [profile.github, profile.linkedin, profile.telegram],
          knowsLanguage: ['en', 'ru'],
        }).replaceAll('<', '\\u003c'),
      },
    ],
  }
})
</script>

<template>
  <SectionsHero />
  <SectionsExperience />
  <SectionsSkills />
  <SectionsProjects />
  <SectionsContact />
</template>
