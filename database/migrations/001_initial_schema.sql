-- =============================================================================
-- Migration 001: Initial Schema
-- AI Job & Internship Search Platform
-- PostgreSQL 16
-- Run order: 001 → 002 → 003
-- =============================================================================

-- Schemas
CREATE SCHEMA IF NOT EXISTS n8n;   -- n8n internal tables
CREATE SCHEMA IF NOT EXISTS public; -- Platform tables

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- Fuzzy text search on job titles

-- =============================================================================
-- USERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT NOT NULL UNIQUE,
  full_name             TEXT,
  auth_provider         TEXT NOT NULL DEFAULT 'local',
  preferences           JSONB NOT NULL DEFAULT '{}',
  notification_channels JSONB NOT NULL DEFAULT '[]',
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

COMMENT ON TABLE  users                   IS 'Authenticated platform users';
COMMENT ON COLUMN users.email             IS 'PII — encrypted at application layer';
COMMENT ON COLUMN users.full_name         IS 'PII — encrypted at application layer';
COMMENT ON COLUMN users.preferences       IS 'User search preferences (target_roles, locations, salary, etc.)';
COMMENT ON COLUMN users.notification_channels IS 'Array of {type, address} objects for notifications';

-- =============================================================================
-- RESUMES
-- =============================================================================
CREATE TABLE IF NOT EXISTS resumes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_path   TEXT NOT NULL,
  file_format TEXT NOT NULL CHECK (file_format IN ('pdf', 'docx', 'txt')),
  raw_text    TEXT,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  version     INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

-- =============================================================================
-- RESUME PROFILES (parsed resume data)
-- =============================================================================
CREATE TABLE IF NOT EXISTS resume_profiles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id        UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES users(id),
  full_name        TEXT,
  email            TEXT,
  phone            TEXT,
  location         TEXT,
  summary          TEXT,
  years_experience DECIMAL(4,1),
  seniority_level  TEXT CHECK (seniority_level IN ('junior','mid','senior','lead','executive')),
  parse_confidence DECIMAL(5,2) DEFAULT 0,
  parsed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  parser_version   TEXT,
  raw_output       JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SKILLS
-- =============================================================================
CREATE TABLE IF NOT EXISTS skills (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_profile_id UUID NOT NULL REFERENCES resume_profiles(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  category          TEXT,
  proficiency       TEXT CHECK (proficiency IN ('beginner','intermediate','advanced','expert')),
  years_used        DECIMAL(4,1),
  is_primary        BOOLEAN NOT NULL DEFAULT FALSE
);

-- =============================================================================
-- EXPERIENCE
-- =============================================================================
CREATE TABLE IF NOT EXISTS experience (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_profile_id UUID NOT NULL REFERENCES resume_profiles(id) ON DELETE CASCADE,
  company_name      TEXT,
  title             TEXT,
  location          TEXT,
  start_date        DATE,
  end_date          DATE,
  is_current        BOOLEAN NOT NULL DEFAULT FALSE,
  description       TEXT,
  achievements      JSONB NOT NULL DEFAULT '[]',
  skills_used       JSONB NOT NULL DEFAULT '[]'
);

-- =============================================================================
-- EDUCATION
-- =============================================================================
CREATE TABLE IF NOT EXISTS education (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_profile_id UUID NOT NULL REFERENCES resume_profiles(id) ON DELETE CASCADE,
  institution       TEXT,
  degree            TEXT,
  field_of_study    TEXT,
  start_date        DATE,
  end_date          DATE,
  gpa               DECIMAL(3,2),
  honors            TEXT
);

-- =============================================================================
-- PROJECTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_profile_id UUID NOT NULL REFERENCES resume_profiles(id) ON DELETE CASCADE,
  name              TEXT,
  description       TEXT,
  url               TEXT,
  technologies      JSONB NOT NULL DEFAULT '[]',
  start_date        DATE,
  end_date          DATE
);

-- =============================================================================
-- COMPANIES
-- =============================================================================
CREATE TABLE IF NOT EXISTS companies (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  website          TEXT,
  industry         TEXT,
  size             TEXT CHECK (size IN ('startup','small','medium','large','enterprise','unknown')),
  founded_year     INTEGER,
  headquarters     TEXT,
  glassdoor_rating DECIMAL(2,1) CHECK (glassdoor_rating BETWEEN 0 AND 5),
  linkedin_url     TEXT,
  is_verified      BOOLEAN NOT NULL DEFAULT FALSE,
  red_flags        JSONB NOT NULL DEFAULT '[]',
  raw_data         JSONB,
  last_verified_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- JOBS
-- =============================================================================
CREATE TABLE IF NOT EXISTS jobs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id       TEXT UNIQUE NOT NULL,
  external_id      TEXT,
  source           TEXT NOT NULL,
  title            TEXT NOT NULL,
  company_id       UUID REFERENCES companies(id),
  company_name     TEXT,
  location         TEXT,
  is_remote        BOOLEAN DEFAULT FALSE,
  employment_type  TEXT,
  experience_level TEXT,
  description      TEXT,
  requirements     JSONB NOT NULL DEFAULT '[]',
  salary_min       INTEGER,
  salary_max       INTEGER,
  salary_currency  TEXT DEFAULT 'USD',
  apply_url        TEXT,
  posted_date      DATE,
  expires_date     DATE,
  is_ghost         BOOLEAN,
  ghost_score      DECIMAL(5,2),
  ghost_signals    JSONB NOT NULL DEFAULT '[]',
  is_scam          BOOLEAN,
  scam_score       DECIMAL(5,2),
  scam_signals     JSONB NOT NULL DEFAULT '[]',
  quality_score    DECIMAL(5,2),
  raw_data         JSONB,
  fetched_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INTERNSHIPS
-- =============================================================================
CREATE TABLE IF NOT EXISTS internships (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id       TEXT UNIQUE NOT NULL,
  external_id      TEXT,
  source           TEXT NOT NULL,
  title            TEXT NOT NULL,
  company_id       UUID REFERENCES companies(id),
  company_name     TEXT,
  location         TEXT,
  is_remote        BOOLEAN DEFAULT FALSE,
  employment_type  TEXT DEFAULT 'internship',
  description      TEXT,
  requirements     JSONB NOT NULL DEFAULT '[]',
  salary_min       INTEGER,
  salary_max       INTEGER,
  salary_currency  TEXT DEFAULT 'USD',
  apply_url        TEXT,
  posted_date      DATE,
  duration_months  INTEGER,
  is_paid          BOOLEAN,
  stipend_amount   DECIMAL(10,2),
  is_ghost         BOOLEAN,
  ghost_score      DECIMAL(5,2),
  is_scam          BOOLEAN,
  scam_score       DECIMAL(5,2),
  quality_score    DECIMAL(5,2),
  raw_data         JSONB,
  fetched_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- RESUME VERSIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS resume_versions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id            UUID NOT NULL REFERENCES resumes(id),
  user_id              UUID NOT NULL REFERENCES users(id),
  job_id               UUID REFERENCES jobs(id),
  version_number       INTEGER NOT NULL DEFAULT 1,
  content              TEXT NOT NULL,
  changes_made         JSONB NOT NULL DEFAULT '[]',
  ats_score_estimated  DECIMAL(5,2),
  model_used           TEXT,
  tokens_used          INTEGER DEFAULT 0,
  file_path            TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- COVER LETTERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS cover_letters (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id),
  job_id       UUID REFERENCES jobs(id),
  content      TEXT NOT NULL,
  tone         TEXT NOT NULL DEFAULT 'formal',
  word_count   INTEGER,
  model_used   TEXT,
  tokens_used  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- APPLICATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  job_id            UUID REFERENCES jobs(id),
  internship_id     UUID REFERENCES internships(id),
  resume_version_id UUID REFERENCES resume_versions(id),
  cover_letter_id   UUID REFERENCES cover_letters(id),
  status            TEXT NOT NULL DEFAULT 'prepared'
                    CHECK (status IN ('prepared','submitted','reviewing','interview_scheduled','interviewed','offer_received','rejected','withdrawn')),
  ats_score         DECIMAL(5,2),
  priority_rank     INTEGER,
  notes             TEXT,
  applied_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT application_has_job CHECK (job_id IS NOT NULL OR internship_id IS NOT NULL)
);

-- =============================================================================
-- APPLICATION STATUS HISTORY
-- =============================================================================
CREATE TABLE IF NOT EXISTS application_status_history (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  from_status    TEXT,
  to_status      TEXT NOT NULL,
  changed_by     TEXT NOT NULL DEFAULT 'system',
  reason         TEXT,
  changed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- ATS REPORTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS ats_reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id    UUID REFERENCES applications(id),
  job_id            UUID REFERENCES jobs(id),
  resume_version_id UUID REFERENCES resume_versions(id),
  match_score       DECIMAL(5,2),
  matching_keywords JSONB NOT NULL DEFAULT '[]',
  missing_keywords  JSONB NOT NULL DEFAULT '[]',
  skill_gaps        JSONB NOT NULL DEFAULT '[]',
  recommendation    TEXT CHECK (recommendation IN ('apply','optimize_first','skip')),
  raw_output        JSONB,
  model_used        TEXT,
  tokens_used       INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  type          TEXT NOT NULL,
  channel       TEXT NOT NULL,
  subject       TEXT,
  body          TEXT,
  payload       JSONB,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','sent','failed')),
  sent_at       TIMESTAMPTZ,
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- EMBEDDINGS (Qdrant pointer registry)
-- =============================================================================
CREATE TABLE IF NOT EXISTS embeddings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     TEXT NOT NULL,
  entity_id       UUID NOT NULL,
  collection_name TEXT NOT NULL,
  qdrant_point_id TEXT,
  model_used      TEXT,
  dimension       INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_type, entity_id)
);

-- =============================================================================
-- PROMPT VERSIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS prompt_versions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id          TEXT NOT NULL,
  version           TEXT NOT NULL,
  prompt_template   TEXT NOT NULL,
  variables         JSONB NOT NULL DEFAULT '[]',
  model_target      TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  performance_notes TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id, version)
);

-- =============================================================================
-- EXECUTION LOGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS execution_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id TEXT NOT NULL,
  user_id      UUID REFERENCES users(id),
  workflow_name TEXT NOT NULL,
  node_name    TEXT,
  agent_id     TEXT,
  status       TEXT CHECK (status IN ('started','completed','failed','skipped','placeholder')),
  duration_ms  INTEGER,
  model_used   TEXT,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  tokens_total INTEGER DEFAULT 0,
  retries      INTEGER DEFAULT 0,
  error_message TEXT,
  metadata     JSONB,
  logged_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SEARCH HISTORY
-- =============================================================================
CREATE TABLE IF NOT EXISTS search_history (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id),
  execution_id     TEXT,
  search_params    JSONB NOT NULL,
  sources_queried  JSONB NOT NULL DEFAULT '[]',
  total_results    INTEGER,
  filtered_results INTEGER,
  searched_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- Auto-update updated_at trigger
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at         BEFORE UPDATE ON users         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_resumes_updated_at       BEFORE UPDATE ON resumes       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_companies_updated_at     BEFORE UPDATE ON companies     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_jobs_updated_at          BEFORE UPDATE ON jobs          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_applications_updated_at  BEFORE UPDATE ON applications  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
