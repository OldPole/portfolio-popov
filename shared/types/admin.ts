import type { PortfolioHome, PortfolioProfile, Project } from './portfolio';

export const adminSections = [
  'profile',
  'experience',
  'skills',
  'education',
  'languages',
  'projects',
] as const;

export type AdminSection = (typeof adminSections)[number];

export type SaveAction = 'draft' | 'publish' | 'unpublish';

export interface ContentObject {
  [key: string]: ContentValue | undefined;
}

export type ContentValue = string | number | ContentObject | ContentValue[];

export interface AdminEntry {
  key: string;
  content: ContentObject;
  position: number;
  revision: number;
  published: boolean;
  hasDraft: boolean;
}

export interface PreviewContent {
  home?: PortfolioHome;
  profile: PortfolioProfile;
  project?: Project;
}
