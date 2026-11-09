import { siteOrigin } from '#shared/utils/site-origin';

export default defineEventHandler(event => {
  const origin = siteOrigin(useRuntimeConfig(event).public.siteUrl);

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');

  return `User-agent: *\nAllow: /\nDisallow: /api/\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`;
});
