export type Locale = 'en' | 'ru'
export type Localized<T> = Record<Locale, T>

export interface ProjectImage {
  src: string
  width: number
  height: number
  caption: Localized<string>
}

export interface Project {
  slug: string
  name: string
  year: string
  category: Localized<string>
  description: Localized<string>
  overview: Localized<string[]>
  contribution: Localized<string>
  highlights: Localized<string[]>
  implementation: Localized<{ title: string; body: string }[]>
  stack: string[]
  repository: string
  demo?: string
  image: string
  imageWidth: number
  imageHeight: number
  imageCaption: Localized<string>
  gallery: ProjectImage[]
  accent: string
}
