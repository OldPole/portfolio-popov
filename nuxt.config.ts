import tailwindcss from '@tailwindcss/vite'
import windowsPathCompatibility from './modules/windows-path-compatibility'
import { publicPagePaths } from './shared/data/routes'

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
    defaultLocale: 'en',
    strategy: 'prefix',
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
    ],
  },
  runtimeConfig: {
    public: { siteUrl: '' },
    resendApiKey: '',
    contactFrom: '',
    contactTo: 'ipetr6828@gmail.com',
    contactAllowedOrigin: '',
  },
  routeRules: {
    '/fonts/**': {
      headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' },
    },
    '/images/**': {
      headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=86400' },
    },
    '/_ipx/**': {
      headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' },
    },
    '/': { redirect: '/en' },
    ...Object.fromEntries(
      ['en', 'ru'].flatMap((locale) =>
        publicPagePaths.map((path) => [`/${locale}${path}`, { prerender: true }]),
      ),
    ),
    '/en/projects/**': { prerender: true },
    '/ru/projects/**': { prerender: true },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/manrope-latin.woff2',
          crossorigin: 'anonymous',
        },
      ],
      meta: [{ name: 'theme-color', content: '#111113' }],
    },
  },
  typescript: { strict: true },
  nitro: { prerender: { crawlLinks: true }, compressPublicAssets: true },
})
