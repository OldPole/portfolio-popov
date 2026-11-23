import type { H3Event } from 'h3';
import type { AdminEntry, AdminSection, SaveAction } from '#shared/types/admin';
import { queryPortfolio } from './database';
import { validateAdminContent } from './admin-validation';

const collections = {
  experience: 'experience',
  skills: 'skill_groups',
  education: 'education',
  languages: 'languages',
  projects: 'projects',
} as const;

function collection(section: Exclude<AdminSection, 'profile'>) {
  return {
    table: `portfolio.${collections[section]}`,
    keyColumn: section === 'projects' ? 'slug' : 'key',
  };
}

const profileFields = `'profile' AS key, COALESCE(draft, content) AS content,
  revision, 0 AS position, true AS published, draft IS NOT NULL AS "hasDraft"`;

const entryFields = (
  key: string,
) => `${key} AS key, COALESCE(draft, content) AS content,
  revision, COALESCE(draft_position, position) AS position, published, draft IS NOT NULL AS "hasDraft"`;

export async function listAdminContent(event: H3Event, section: AdminSection) {
  if (section === 'profile') {
    return queryPortfolio<AdminEntry>(
      event,
      `SELECT ${profileFields} FROM portfolio.profile WHERE singleton`,
    );
  }

  const { table, keyColumn } = collection(section);

  return queryPortfolio<AdminEntry>(
    event,
    `SELECT ${entryFields(keyColumn)} FROM ${table} ORDER BY position, key`,
  );
}

export async function saveAdminContent(
  event: H3Event,
  section: AdminSection,
  input: {
    key: string;
    revision: number | null;
    position: number;
    action: SaveAction;
    content?: unknown;
  },
) {
  const { key, position, revision, action } = input;
  const publishing = action === 'publish';
  const content =
    action === 'unpublish'
      ? null
      : JSON.stringify(
          validateAdminContent(section, input.content, publishing),
        );
  let rows: AdminEntry[];

  if (section === 'profile') {
    if (key !== 'profile' || revision === null || action === 'unpublish') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid profile action',
      });
    }

    const changes = publishing
      ? 'content = $2::jsonb, draft = NULL'
      : 'draft = $2::jsonb';

    rows = await queryPortfolio<AdminEntry>(
      event,
      `UPDATE portfolio.profile SET ${changes}, revision = revision + 1
       WHERE singleton AND revision = $1 RETURNING ${profileFields}`,
      [revision, content],
    );
  } else {
    const { table, keyColumn } = collection(section);
    const returning = entryFields(keyColumn);

    if (action === 'unpublish') {
      rows = await queryPortfolio<AdminEntry>(
        event,
        `UPDATE ${table} SET published = false, revision = revision + 1
         WHERE ${keyColumn} = $1 AND revision = $2 RETURNING ${returning}`,
        [key, revision],
      );
    } else if (revision === null) {
      const values = publishing
        ? '($1, $2, true, $3::jsonb, NULL, NULL)'
        : "($1, $2, false, '{}'::jsonb, $3::jsonb, $2)";

      rows = await queryPortfolio<AdminEntry>(
        event,
        `INSERT INTO ${table} (${keyColumn}, position, published, content, draft, draft_position)
         VALUES ${values} ON CONFLICT DO NOTHING RETURNING ${returning}`,
        [key, position, content],
      );
    } else {
      const changes = publishing
        ? 'content = $4::jsonb, position = $3, published = true, draft = NULL, draft_position = NULL'
        : 'draft = $4::jsonb, draft_position = $3';

      rows = await queryPortfolio<AdminEntry>(
        event,
        `UPDATE ${table} SET ${changes}, revision = revision + 1
         WHERE ${keyColumn} = $1 AND revision = $2 RETURNING ${returning}`,
        [key, revision, position, content],
      );
    }
  }

  if (!rows[0]) {
    throw createError({
      statusCode: 409,
      statusMessage: 'The entry has changed or the address is already in use',
    });
  }

  return rows[0];
}
