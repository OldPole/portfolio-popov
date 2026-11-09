<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue';

import { projects } from '#shared/data/projects';
import { profile } from '~/data/profile';

withDefaults(defineProps<{ headingTag?: 'h1' | 'h2'; numbered?: boolean }>(), {
  headingTag: 'h2',
  numbered: true,
});

const { t } = useI18n();
</script>

<template>
  <section
    id="projects"
    class="section container"
    aria-labelledby="projects-title"
  >
    <div class="section-heading">
      <div>
        <p class="eyebrow">
          <span v-if="numbered">03 /</span>
          {{ t('projects.eyebrow') }}
        </p>
        <component :is="headingTag" id="projects-title">
          {{ t('projects.title') }}
        </component>
      </div>

      <p class="section-intro">{{ t('projects.intro') }}</p>
    </div>

    <div class="projects-grid">
      <ProjectsProjectCard
        v-for="(project, index) in projects"
        :key="project.slug"
        :project="project"
        :index="index"
        :heading-tag="headingTag === 'h1' ? 'h2' : 'h3'"
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
