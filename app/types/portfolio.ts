export type Locale = 'en' | 'ru'
export type Localized<T> = Record<Locale, T>

export interface Project {
  slug: string
  name: string
  year: string
  category: Localized<string>
  description: Localized<string>
  contribution: Localized<string>
  highlights: Localized<string[]>
  stack: string[]
  repository: string
  demo?: string
  image?: string
  gallery?: string[]
  accent: string
}
