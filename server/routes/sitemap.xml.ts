import { projects } from '#shared/data/projects'
import { siteOrigin } from '#shared/utils/site-origin'

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

export default defineEventHandler((event) => {
  const origin = siteOrigin(useRuntimeConfig(event).public.siteUrl)
  if (!origin)
    throw createError({
      statusCode: 503,
      statusMessage: 'Set NUXT_PUBLIC_SITE_URL before deploying',
    })
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  const paths = ['', ...projects.map((project) => `/projects/${project.slug}`)]
  const entries = paths
    .flatMap((path) =>
      ['en', 'ru'].map((locale) => {
        const alternate = ['en', 'ru', 'x-default']
          .map(
            (language) =>
              `<xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(`${origin}/${language === 'x-default' ? 'en' : language}${path}`)}"/>`,
          )
          .join('')
        return `<url><loc>${escapeXml(`${origin}/${locale}${path}`)}</loc>${alternate}</url>`
      }),
    )
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`
})
