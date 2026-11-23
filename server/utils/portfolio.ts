import type { H3Event } from 'h3';
import type { AdminSection } from '#shared/types/admin';
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

const homeSectionsSql = (includeDraft: boolean) =>
  Object.entries(homeSections)
    .map(([section, table]) => {
      const isDraft = includeDraft ? `$1 = '${section}' AND key = $2` : 'false';
      const source = includeDraft
        ? `CASE WHEN ${isDraft} THEN COALESCE(draft, content) ELSE content END`
        : 'content';
      const position = includeDraft
        ? `CASE WHEN ${isDraft} THEN COALESCE(draft_position, position) ELSE position END`
        : 'position';

      return `
      (
        SELECT COALESCE(
          jsonb_agg((${source}) || jsonb_build_object('key', key) ORDER BY ${position}, key),
          '[]'::jsonb
        )
        FROM portfolio.${table}
        WHERE published OR (${isDraft})
      ) AS ${section}
      `;
    })
    .join(',');

export async function readPortfolioHome(
  event: H3Event,
  preview?: { section: AdminSection; key: string },
) {
  const [home] = await queryPortfolio<PortfolioHome>(
    event,
    `SELECT ${homeSectionsSql(Boolean(preview))},
      (
        SELECT COALESCE(jsonb_agg(
          (content - ARRAY['overview', 'contribution', 'highlights', 'implementation', 'imageCaption', 'gallery'])
            || jsonb_build_object('slug', slug)
          ORDER BY position, slug
        ), '[]'::jsonb)
        FROM portfolio.projects
        WHERE published
      ) AS projects`,
    preview ? [preview.section, preview.key] : [],
  );

  return home!;
}

export async function readPortfolioProfile(event: H3Event, preview = false) {
  const [row] = await queryPortfolio<{ content: PortfolioProfile }>(
    event,
    `SELECT ${preview ? 'COALESCE(draft, content)' : 'content'} AS content
     FROM portfolio.profile WHERE singleton`,
  );

  if (!row) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Portfolio content has not been initialized',
    });
  }

  return row.content;
}

export async function readPortfolioProject(
  event: H3Event,
  slug: string,
  preview = false,
) {
  const [row] = await queryPortfolio<{ project: Project }>(
    event,
    `SELECT ${preview ? 'COALESCE(draft, content)' : 'content'} || jsonb_build_object('slug', slug) AS project
     FROM portfolio.projects
     WHERE slug = $1 ${preview ? '' : 'AND published'}`,
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
