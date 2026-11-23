import { readdir, readFile } from 'node:fs/promises';
import pg from 'pg';

const { Client } = pg;
const command = process.argv[2];

async function applyMigrations(client) {
  const directory = new URL('../database/migrations/', import.meta.url);
  const filenames = (await readdir(directory)).filter(name =>
    name.endsWith('.sql'),
  );

  for (const name of filenames.sort()) {
    const applied = await client.query(
      "SELECT 1 FROM portfolio.schema_versions WHERE kind = 'migration' AND name = $1",
      [name],
    );

    if (applied.rowCount) {
      continue;
    }

    await client.query(await readFile(new URL(name, directory), 'utf8'));
    await client.query(
      "INSERT INTO portfolio.schema_versions (kind, name) VALUES ('migration', $1)",
      [name],
    );
  }
}

async function seedPortfolio(client) {
  const name = '001-portfolio';
  const applied = await client.query(
    "SELECT 1 FROM portfolio.schema_versions WHERE kind = 'seed' AND name = $1",
    [name],
  );

  if (applied.rowCount) {
    return;
  }

  const source = new URL(
    '../database/seeds/001-portfolio.json',
    import.meta.url,
  );
  const data = JSON.parse(await readFile(source, 'utf8'));

  await client.query(
    'INSERT INTO portfolio.profile (content) VALUES ($1::jsonb) ON CONFLICT DO NOTHING',
    [JSON.stringify(data.profile)],
  );

  const groups = [
    ['experience', 'key', data.experience],
    ['skill_groups', 'key', data.skills],
    ['education', 'key', data.education],
    ['languages', 'key', data.languages],
    ['projects', 'slug', data.projects],
  ];

  for (const [table, key, entries] of groups) {
    const records = entries.map(({ [key]: id, ...content }, position) => ({
      id,
      position,
      content,
    }));

    await client.query(
      `INSERT INTO portfolio.${table} (${key}, position, published, content)
       SELECT id, position, true, content
       FROM jsonb_to_recordset($1::jsonb) AS entries(id text, position integer, content jsonb)
       ON CONFLICT DO NOTHING`,
      [JSON.stringify(records)],
    );
  }

  await client.query(
    "INSERT INTO portfolio.schema_versions (kind, name) VALUES ('seed', $1)",
    [name],
  );
}

async function run() {
  const connectionString = process.env.NUXT_DATABASE_URL;

  if (!connectionString || !['migrate', 'seed', 'setup'].includes(command)) {
    throw new Error(
      'Set NUXT_DATABASE_URL and use db:migrate, db:seed or db:setup.',
    );
  }

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(410504, 1)');
    await client.query('CREATE SCHEMA IF NOT EXISTS portfolio');
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio.schema_versions (
        kind text NOT NULL,
        name text NOT NULL,
        applied_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (kind, name)
      )
    `);

    if (command !== 'seed') {
      await applyMigrations(client);
    }

    if (command !== 'migrate') {
      await seedPortfolio(client);
    }

    await client.query('COMMIT');
  } finally {
    await client.end();
  }

  process.stdout.write(`Database ${command} complete.\n`);
}

run().catch(error => {
  console.error(`Database ${command} failed: ${error.code || error.message}`);
  process.exitCode = 1;
});
