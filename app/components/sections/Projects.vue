<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue';

import type { PortfolioHome } from '#shared/types/portfolio';
import { usePortfolioProfile } from '~/composables/usePortfolioProfile';

defineProps<Pick<PortfolioHome, 'projects'>>();

const profile = usePortfolioProfile();
const { t } = useI18n();
</script>

<template>
  <section
    id="projects"
    class="section container"
    aria-labelledby="projects-title"
  >
    <div class="section-heading">
      <h2 id="projects-title">
        {{ t('projects.title') }}
      </h2>
    </div>

    <div class="projects-grid">
      <ProjectsProjectCard
        v-for="project in projects"
        :key="project.slug"
        :project="project"
      />
    </div>

    <UiButton
      :href="profile.github"
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      class="github-more"
    >
      {{ t('projects.all') }}
      <ArrowUpRight :size="16" aria-hidden="true" />
    </UiButton>
  </section>
</template>
