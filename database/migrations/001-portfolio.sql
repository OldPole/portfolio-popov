CREATE TABLE portfolio.profile (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object')
);

CREATE TABLE portfolio.experience (
  key text PRIMARY KEY CHECK (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
  published boolean NOT NULL DEFAULT false,
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object')
);

CREATE TABLE portfolio.skill_groups (LIKE portfolio.experience INCLUDING ALL);
CREATE TABLE portfolio.education (LIKE portfolio.experience INCLUDING ALL);
CREATE TABLE portfolio.languages (LIKE portfolio.experience INCLUDING ALL);

CREATE TABLE portfolio.projects (
  slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
  published boolean NOT NULL DEFAULT false,
  content jsonb NOT NULL CHECK (jsonb_typeof(content) = 'object')
);
