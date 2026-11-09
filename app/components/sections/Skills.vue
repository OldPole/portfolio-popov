<script setup lang="ts">
import { GraduationCap, Languages } from '@lucide/vue'
import { skills } from '~/data/profile'
const { t } = useI18n()
</script>

<template>
  <section id="skills" class="section skills-section" aria-labelledby="skills-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ t('skills.eyebrow') }}</p>
          <h2 id="skills-title">{{ t('skills.title') }}</h2>
        </div>
        <p class="section-intro">{{ t('skills.intro') }}</p>
      </div>
      <div class="skills-grid">
        <div class="skill-groups">
          <div v-for="group in skills" :key="group.key" class="skill-group">
            <h3>{{ t(`skills.${group.key}`) }}</h3>
            <div class="tag-list">
              <span v-for="skill in group.items" :key="skill" class="tag skill-tag"
                ><span
                  v-if="['React', 'Next.js', 'TypeScript'].includes(skill)"
                  class="skill-dot"
                />{{ skill }}</span
              >
            </div>
          </div>
        </div>
        <aside class="background-panel">
          <div class="education-block">
            <p class="small-label">
              <GraduationCap :size="16" aria-hidden="true" />{{ t('skills.education') }}
            </p>
            <h3>{{ t('skills.university') }}</h3>
            <p>{{ t('skills.degree') }}</p>
            <div class="education-meta">
              <span>{{ t('skills.period') }}</span
              ><span>{{ t('skills.grade') }}</span>
            </div>
          </div>
          <div class="languages-block">
            <p class="small-label">
              <Languages :size="16" aria-hidden="true" />{{ t('skills.languages') }}
            </p>
            <div>
              <span>{{ t('skills.english') }}</span
              ><span class="muted">{{ t('skills.englishLevel') }}</span>
            </div>
            <div>
              <span>{{ t('skills.russian') }}</span
              ><span class="muted">{{ t('skills.russianLevel') }}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
