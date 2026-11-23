import { siteOrigin } from '#shared/utils/site-origin';
import { usePortfolioLocale } from './usePortfolioLocale';
import { usePortfolioProfile } from './usePortfolioProfile';

export function usePortfolioSeo(options: {
  title: () => string;
  description: () => string;
  image?: () => string;
  imageWidth?: () => number;
  imageHeight?: () => number;
}) {
  const lang = usePortfolioLocale();
  const profile = usePortfolioProfile();
  const route = useRoute();
  const config = useRuntimeConfig();

  const origin = computed(() => siteOrigin(config.public.siteUrl));
  const canonical = computed(() =>
    origin.value ? `${origin.value}${route.path}` : undefined,
  );
  const image = computed(() =>
    origin.value
      ? `${origin.value}${options.image?.() || '/images/portfolio-social.jpg'}`
      : undefined,
  );

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogTitle: options.title,
    ogDescription: options.description,
    ogType: 'website',
    ogSiteName: () => profile.value.name[lang.value],
    ogUrl: () => canonical.value,
    ogLocale: () => (lang.value === 'ru' ? 'ru_RU' : 'en_US'),
    ogImage: () => image.value,
    ogImageWidth: () => options.imageWidth?.() || 1200,
    ogImageHeight: () => options.imageHeight?.() || 630,
    ogImageAlt: options.title,
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
    twitterImage: () => image.value,
    twitterImageAlt: options.title,
  });

  useHead(() => {
    if (!origin.value) {
      return {};
    }

    const pagePath = route.path.replace(/^\/(en|ru)(?=\/|$)/, '');

    return {
      link: [
        { key: 'canonical', rel: 'canonical', href: canonical.value! },
        {
          key: 'alternate-en',
          rel: 'alternate',
          hreflang: 'en',
          href: `${origin.value}/en${pagePath}`,
        },
        {
          key: 'alternate-ru',
          rel: 'alternate',
          hreflang: 'ru',
          href: `${origin.value}/ru${pagePath}`,
        },
        {
          key: 'alternate-default',
          rel: 'alternate',
          hreflang: 'x-default',
          href: `${origin.value}/en${pagePath}`,
        },
      ],
    };
  });
}
