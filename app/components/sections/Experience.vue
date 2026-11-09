<script setup lang="ts">
import { ArrowDownToLine, ArrowUpRight } from '@lucide/vue';

import { experience } from '~/data/experience';
import { profile } from '~/data/profile';
import { usePortfolioLocale } from '~/composables/usePortfolioLocale';

withDefaults(defineProps<{ headingTag?: 'h1' | 'h2'; numbered?: boolean }>(), {
  headingTag: 'h2',
  numbered: true,
});

const { t } = useI18n();
const lang = usePortfolioLocale();
</script>

<template>
  <section
    id="experience"
    class="section container"
    aria-labelledby="experience-title"
  >
    <div class="section-heading">
      <div>
        <p class="eyebrow">
          <span v-if="numbered">01 /</span>
          {{ t('experience.eyebrow') }}
        </p>
        <component :is="headingTag" id="experience-title">
          {{ t('experience.title') }}
        </component>
      </div>

      <p class="section-intro">{{ t('experience.intro') }}</p>
    </div>

    <div class="experience-list">
      <article
        v-for="job in experience"
        :key="job.company"
        class="experience-row"
      >
        <div class="experience-company">
          <div class="company-icon" :class="job.className" aria-hidden="true">
            {{ job.initial }}
          </div>

          <div>
            <component :is="headingTag === 'h1' ? 'h2' : 'h3'">
              {{ job.company }}
            </component>
            <span class="muted text-sm">{{ job.location[lang] }}</span>
          </div>
        </div>

        <div class="experience-detail">
          <div class="experience-title">
            <component :is="headingTag === 'h1' ? 'h3' : 'h4'">
              {{ job.role[lang] }}
            </component>
            <span class="date-label">{{ job.period[lang] }}</span>
          </div>

          <p>{{ job.description[lang] }}</p>
          <ul>
            <li v-for="point in job.points[lang]" :key="point">
              {{ point }}
            </li>
          </ul>
          <div class="tag-list">
            <span v-for="tag in job.tags" :key="tag" class="tag tag-subtle">
              {{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <a :href="profile.cv" download class="cv-strip">
      <span>
        <ArrowDownToLine :size="18" aria-hidden="true" />
        {{ t('experience.cv') }}
      </span>
      <span>
        {{ t('common.download') }}
        <ArrowUpRight :size="16" aria-hidden="true" />
      </span>
    </a>
  </section>
</template>
