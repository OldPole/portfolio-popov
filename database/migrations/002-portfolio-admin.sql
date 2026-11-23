ALTER TABLE portfolio.profile
  ADD COLUMN draft jsonb CHECK (jsonb_typeof(draft) = 'object'),
  ADD COLUMN revision integer NOT NULL DEFAULT 0;

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['experience', 'skill_groups', 'education', 'languages', 'projects']
  LOOP
    EXECUTE format(
      'ALTER TABLE portfolio.%I
       ADD COLUMN draft jsonb CHECK (jsonb_typeof(draft) = ''object''),
       ADD COLUMN draft_position integer CHECK (draft_position >= 0),
       ADD COLUMN revision integer NOT NULL DEFAULT 0,
       ADD CONSTRAINT draft_position_requires_draft CHECK ((draft IS NULL) = (draft_position IS NULL))',
      table_name
    );
    EXECUTE format('UPDATE portfolio.%I SET position = (position + 1) * 10', table_name);
  END LOOP;
END
$$;

CREATE TABLE portfolio.admin_sessions (
  token_hash text PRIMARY KEY,
  expires_at timestamptz NOT NULL
);

CREATE TABLE portfolio.media (
  id uuid PRIMARY KEY,
  bytes bytea NOT NULL,
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0)
);
