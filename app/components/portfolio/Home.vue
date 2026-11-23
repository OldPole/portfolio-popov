<script setup lang="ts">
import type { PortfolioHome } from '#shared/types/portfolio';

defineProps<{ home: PortfolioHome; preview?: boolean }>();
</script>

<template>
  <SectionsHero />
  <SectionsExperience :experience="home.experience" />
  <SectionsSkills
    :skills="home.skills"
    :education="home.education"
    :languages="home.languages"
  />
  <SectionsProjects :projects="home.projects" />
  <SectionsContact :preview="preview" />
</template>
