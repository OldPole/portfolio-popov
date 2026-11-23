import type { InjectionKey, Ref } from 'vue';
import type { PortfolioProfile } from '#shared/types/portfolio';

export const portfolioProfileKey: InjectionKey<
  Readonly<Ref<PortfolioProfile>>
> = Symbol('portfolio-profile');

export function usePortfolioProfile() {
  const profile = inject(portfolioProfileKey);

  if (!profile) {
    throw new Error('Portfolio profile must be provided by the site layout.');
  }

  return profile;
}
