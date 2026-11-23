export type Locale = 'en' | 'ru';

export type Localized<T> = Record<Locale, T>;

export interface PortfolioProfile {
  name: Localized<string>;
  wordmark: string;
  role: Localized<string>;
  description: Localized<string>;
  location: Localized<string>;
  email: string;
  telegram: string;
  telegramHandle: string;
  github: string;
  linkedin: string;
  cv: string;
  portrait: ProjectImage;
  seo: Localized<{ title: string; description: string }>;
}

export interface Experience {
  key: string;
  company: string;
  initial: string;
  className?: string;
  location: Localized<string>;
  role: Localized<string>;
  period: Localized<string>;
  description: Localized<string>;
  points: Localized<string[]>;
  tags: string[];
}

export interface SkillGroup {
  key: string;
  label: Localized<string>;
  items: string[];
}

export interface Education {
  key: string;
  school: Localized<string>;
  degree: Localized<string>;
  period: Localized<string>;
  grade: Localized<string>;
}

export interface Language {
  key: string;
  name: Localized<string>;
  level: Localized<string>;
}

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  caption: Localized<string>;
}

export interface Project {
  slug: string;
  name: string;
  year: string;
  category: Localized<string>;
  description: Localized<string>;
  overview: Localized<string[]>;
  contribution: Localized<string>;
  highlights: Localized<string[]>;
  implementation: Localized<{ title: string; body: string }[]>;
  stack: string[];
  repository: string;
  demo?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageCaption: Localized<string>;
  gallery: ProjectImage[];
  accent: string;
}

export type ProjectSummary = Pick<
  Project,
  | 'slug'
  | 'name'
  | 'year'
  | 'category'
  | 'description'
  | 'stack'
  | 'repository'
  | 'demo'
  | 'image'
  | 'imageWidth'
  | 'imageHeight'
  | 'accent'
>;

export interface PortfolioHome {
  experience: Experience[];
  skills: SkillGroup[];
  education: Education[];
  languages: Language[];
  projects: ProjectSummary[];
}
