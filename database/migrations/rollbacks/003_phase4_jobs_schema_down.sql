-- ============================================================================
-- Phase 4: Jobs Schema Rollback
-- ============================================================================

DROP TRIGGER IF EXISTS set_timestamp_applications ON applications;
DROP TRIGGER IF EXISTS set_timestamp_saved_jobs ON saved_jobs;
DROP TRIGGER IF EXISTS set_timestamp_jobs ON jobs;
DROP TRIGGER IF EXISTS set_timestamp_companies ON companies;

DROP TABLE IF EXISTS workflow_logs;
DROP TABLE IF EXISTS agent_runs;
DROP TABLE IF EXISTS application_history;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS saved_jobs;
DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;
