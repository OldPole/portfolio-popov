<script setup lang="ts">
import { ArrowUpRight, LoaderCircle, Send } from '@lucide/vue'
import { profile } from '~/data/profile'
import { useContactForm } from '~/composables/useContactForm'

withDefaults(defineProps<{ headingTag?: 'h1' | 'h2' }>(), { headingTag: 'h2' })

const { t } = useI18n()
const { form, pending, status, feedback, submit } = useContactForm()
</script>

<template>
  <section
    id="contact"
    class="contact-section"
    aria-labelledby="contact-title"
  >
    <div class="container contact-grid">
      <div class="contact-copy">
        <p class="eyebrow">{{ t('contact.eyebrow') }}</p>
        <component
          :is="headingTag"
          id="contact-title"
        >
          {{ t('contact.title') }}
          <span class="accent">↗</span>
        </component>
        <p class="contact-intro">{{ t('contact.intro') }}</p>
        <div class="contact-email">
          <span class="small-label">{{ t('contact.emailLabel') }}</span>
          <a :href="`mailto:${profile.email}`">
            {{ profile.email }}
            <ArrowUpRight
              :size="22"
              aria-hidden="true"
            />
          </a>
        </div>
        <div class="contact-socials">
          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
          >
            <UiSocialIcon
              name="github"
              :size="16"
              aria-hidden="true"
            />
            GitHub
            <ArrowUpRight
              :size="13"
              aria-hidden="true"
            />
          </a>
          <a
            :href="profile.linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <UiSocialIcon
              name="linkedin"
              :size="16"
              aria-hidden="true"
            />
            LinkedIn
            <ArrowUpRight
              :size="13"
              aria-hidden="true"
            />
          </a>
          <a
            :href="profile.telegram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Send
              :size="16"
              aria-hidden="true"
            />
            Telegram
            <ArrowUpRight
              :size="13"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
      <form
        class="contact-form"
        :aria-label="t('contact.formTitle')"
        :aria-busy="pending"
        @submit.prevent="submit"
      >
        <component :is="headingTag === 'h1' ? 'h2' : 'h3'">{{ t('contact.formTitle') }}</component>
        <div class="form-field">
          <label for="contact-name">
            {{ t('contact.name') }}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            v-model="form.name"
            name="name"
            autocomplete="name"
            :placeholder="t('contact.namePlaceholder')"
            minlength="2"
            maxlength="100"
            required
            :disabled="pending"
          />
        </div>
        <div class="form-field">
          <label for="contact-email">
            {{ t('contact.email') }}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            :placeholder="t('contact.emailPlaceholder')"
            maxlength="254"
            required
            :disabled="pending"
          />
        </div>
        <div class="form-field">
          <label for="contact-message">
            {{ t('contact.message') }}
            <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            v-model="form.message"
            name="message"
            :placeholder="t('contact.messagePlaceholder')"
            minlength="10"
            maxlength="5000"
            rows="4"
            required
            :disabled="pending"
          />
        </div>
        <div
          class="honeypot"
          aria-hidden="true"
        >
          <label for="contact-website">{{ t('contact.website') }}</label>
          <input
            id="contact-website"
            v-model="form.website"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>
        <div
          v-if="feedback"
          class="form-feedback"
          :class="status"
          role="status"
          aria-live="polite"
        >
          <p>{{ feedback }}</p>
          <a
            v-if="status === 'error'"
            :href="`mailto:${profile.email}`"
          >
            {{ profile.email }} ↗
          </a>
        </div>
        <UiButton
          type="submit"
          class="form-submit"
          :disabled="pending"
        >
          <span>{{ t(pending ? 'contact.sending' : 'contact.send') }}</span>
          <LoaderCircle
            v-if="pending"
            :size="17"
            class="animate-spin"
            aria-hidden="true"
          />
          <ArrowUpRight
            v-else
            :size="18"
            aria-hidden="true"
          />
        </UiButton>
        <p class="form-privacy">{{ t('contact.privacy') }}</p>
      </form>
    </div>
  </section>
</template>
