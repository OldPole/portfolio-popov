import type { H3Event } from 'h3';
import pg from 'pg';
import type { Pool, QueryResultRow } from 'pg';

let pool: Pool | undefined;

function getPool(event: H3Event) {
  const { databaseUrl } = useRuntimeConfig(event);

  if (!databaseUrl) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Portfolio database is not configured',
    });
  }

  if (!pool) {
    pool = new pg.Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 3000,
      statement_timeout: 5000,
      max: 5,
    });

    pool.on('error', () => {
      console.error('An idle PostgreSQL connection closed unexpectedly.');
    });
  }

  return pool;
}

export async function queryPortfolio<Row extends QueryResultRow>(
  event: H3Event,
  statement: string,
  parameters: unknown[] = [],
) {
  const database = getPool(event);

  try {
    const result = await database.query<Row>(statement, parameters);

    return result.rows;
  } catch (error) {
    const code =
      error instanceof Error && 'code' in error ? error.code : 'unknown';

    console.error('Portfolio PostgreSQL query failed.', code);

    throw createError({
      statusCode: 503,
      statusMessage: 'Portfolio content is temporarily unavailable',
    });
  }
}
