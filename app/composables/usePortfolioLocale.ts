import type { Locale } from '~/types/portfolio'

export function usePortfolioLocale() {
  const { locale } = useI18n()
  return computed<Locale>(() => (locale.value === 'ru' ? 'ru' : 'en'))
}
