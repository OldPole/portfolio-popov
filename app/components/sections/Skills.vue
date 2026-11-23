<script setup lang="ts">
import { GraduationCap, Languages } from '@lucide/vue';

import type { PortfolioHome } from '#shared/types/portfolio';
import { usePortfolioLocale } from '~/composables/usePortfolioLocale';

defineProps<Pick<PortfolioHome, 'skills' | 'education' | 'languages'>>();

const lang = usePortfolioLocale();
const { t } = useI18n();
</script>

<template>
  <section
    id="skills"
    class="section skills-section"
    aria-labelledby="skills-title"
  >
    <div class="container">
      <div class="section-heading">
        <h2 id="skills-title">{{ t('skills.title') }}</h2>
      </div>

      <div class="skills-grid">
        <div class="skill-groups">
          <div v-for="group in skills" :key="group.key" class="skill-group">
            <h3>{{ group.label[lang] }}</h3>
            <div class="tag-list">
              <span
                v-for="skill in group.items"
                :key="skill"
                class="tag skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <aside
          v-if="education.length || languages.length"
          class="background-panel"
        >
          <div v-if="education.length" class="education-block">
            <p class="small-label">
              <GraduationCap :size="16" aria-hidden="true" />
              {{ t('skills.education') }}
            </p>
            <article v-for="entry in education" :key="entry.key">
              <h3>{{ entry.school[lang] }}</h3>
              <p>{{ entry.degree[lang] }}</p>
              <div class="education-meta">
                <span>{{ entry.period[lang] }}</span>
                <span>{{ entry.grade[lang] }}</span>
              </div>
            </article>
          </div>

          <div v-if="languages.length" class="languages-block">
            <p class="small-label">
              <Languages :size="16" aria-hidden="true" />
              {{ t('skills.languages') }}
            </p>
            <div v-for="language in languages" :key="language.key">
              <span>{{ language.name[lang] }}</span>
              <span class="muted">{{ language.level[lang] }}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
