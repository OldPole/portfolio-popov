import tailwindcss from '@tailwindcss/vite'
import windowsPathCompatibility from './modules/windows-path-compatibility'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-09',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/eslint',
    windowsPathCompatibility,
  ],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  colorMode: { preference: 'dark', fallback: 'dark', classSuffix: '', storageKey: 'popov-theme' },
  i18n: {
    baseUrl: 'http://localhost:3000',
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
    ],
  },
  runtimeConfig: {
    resendApiKey: '',
    contactFrom: '',
    contactTo: 'ipetr6828@gmail.com',
    contactAllowedOrigin: '',
  },
  routeRules: {
    '/': { redirect: '/en' },
    '/en': { prerender: true },
    '/ru': { prerender: true },
    '/en/projects/**': { prerender: true },
    '/ru/projects/**': { prerender: true },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [{ name: 'theme-color', content: '#111113' }],
    },
  },
  typescript: { strict: true },
  nitro: { prerender: { crawlLinks: true } },
})
