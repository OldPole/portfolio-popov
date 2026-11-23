<script setup lang="ts">
import { usePortfolioSeo } from '~/composables/usePortfolioSeo';
import { usePortfolioLocale } from '~/composables/usePortfolioLocale';
import { usePortfolioProfile } from '~/composables/usePortfolioProfile';
import { siteOrigin } from '#shared/utils/site-origin';

const lang = usePortfolioLocale();
const profile = usePortfolioProfile();
const config = useRuntimeConfig();
const { data: home, error } = await useFetch('/api/portfolio');

if (!home.value || error.value) {
  throw createError({
    statusCode: 503,
    statusMessage: 'Portfolio content is temporarily unavailable',
    fatal: true,
  });
}

usePortfolioSeo({
  title: () => profile.value.seo[lang.value].title,
  description: () => profile.value.seo[lang.value].description,
});

useHead(() => {
  const origin = siteOrigin(config.public.siteUrl);
  const { name, role, portrait, github, linkedin, telegram } = profile.value;

  return {
    script: [
      {
        key: 'person-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: name[lang.value],
          alternateName: name[lang.value === 'en' ? 'ru' : 'en'],
          jobTitle: role[lang.value],
          ...(origin
            ? {
                url: `${origin}/en`,
                image: new URL(portrait.src, origin).href,
              }
            : {}),
          sameAs: [github, linkedin, telegram],
          knowsLanguage: ['en', 'ru'],
        }).replaceAll('<', '\\u003c'),
      },
    ],
  };
});
</script>

<template>
  <template v-if="home">
    <SectionsHero />
    <SectionsExperience :experience="home.experience" />
    <SectionsSkills
      :skills="home.skills"
      :education="home.education"
      :languages="home.languages"
    />
    <SectionsProjects :projects="home.projects" />
    <SectionsContact />
  </template>
</template>
