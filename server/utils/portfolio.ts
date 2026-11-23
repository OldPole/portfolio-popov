import type { H3Event } from 'h3';
import type {
  PortfolioHome,
  PortfolioProfile,
  Project,
} from '#shared/types/portfolio';
import { queryPortfolio } from './database';

const homeSections = {
  experience: 'experience',
  skills: 'skill_groups',
  education: 'education',
  languages: 'languages',
};

const homeSectionsSql = Object.entries(homeSections)
  .map(
    ([section, table]) => `
      (
        SELECT COALESCE(
          jsonb_agg(content || jsonb_build_object('key', key) ORDER BY position, key),
          '[]'::jsonb
        )
        FROM portfolio.${table}
        WHERE published
      ) AS ${section}
    `,
  )
  .join(',');

export async function readPortfolioHome(event: H3Event) {
  const [home] = await queryPortfolio<PortfolioHome>(
    event,
    `SELECT ${homeSectionsSql},
      (
        SELECT COALESCE(jsonb_agg(
          (content - ARRAY['overview', 'contribution', 'highlights', 'implementation', 'imageCaption', 'gallery'])
            || jsonb_build_object('slug', slug)
          ORDER BY position, slug
        ), '[]'::jsonb)
        FROM portfolio.projects
        WHERE published
      ) AS projects`,
  );

  return home!;
}

export async function readPortfolioProfile(event: H3Event) {
  const [row] = await queryPortfolio<{ content: PortfolioProfile }>(
    event,
    'SELECT content FROM portfolio.profile WHERE singleton',
  );

  if (!row) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Portfolio content has not been initialized',
    });
  }

  return row.content;
}

export async function readPortfolioProject(event: H3Event, slug: string) {
  const [row] = await queryPortfolio<{ project: Project }>(
    event,
    `SELECT content || jsonb_build_object('slug', slug) AS project
     FROM portfolio.projects
     WHERE slug = $1 AND published`,
    [slug],
  );

  return row?.project;
}

export async function readPortfolioProjectSlugs(event: H3Event) {
  const rows = await queryPortfolio<{ slug: string }>(
    event,
    'SELECT slug FROM portfolio.projects WHERE published ORDER BY position, slug',
  );

  return rows.map(row => row.slug);
}
