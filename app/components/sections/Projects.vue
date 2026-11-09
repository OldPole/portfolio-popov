<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { projects } from '#shared/data/projects'
import { profile } from '~/data/profile'
const { t } = useI18n()
</script>

<template>
  <section id="projects" class="section container" aria-labelledby="projects-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">{{ t('projects.eyebrow') }}</p>
        <h2 id="projects-title">{{ t('projects.title') }}</h2>
      </div>
      <p class="section-intro">{{ t('projects.intro') }}</p>
    </div>
    <div class="projects-grid">
      <ProjectsProjectCard
        v-for="(project, index) in projects"
        :key="project.slug"
        :project="project"
        :index="index"
      />
    </div>
    <a
      :href="profile.github"
      target="_blank"
      rel="noopener noreferrer"
      class="button button-outline github-more"
      >{{ t('projects.all') }}<ArrowUpRight :size="16" aria-hidden="true"
    /></a>
  </section>
</template>
