-- ============================================================================
-- Phase 3: AI Intelligence Layer Schema Rollback
-- ============================================================================

DROP TRIGGER IF EXISTS set_timestamp_job_descriptions ON job_descriptions;
DROP TRIGGER IF EXISTS set_timestamp_resumes ON resumes;

DROP TABLE IF EXISTS embeddings_metadata;
DROP TABLE IF EXISTS ats_results;
DROP TABLE IF EXISTS job_descriptions;
DROP TABLE IF EXISTS resume_versions;
DROP TABLE IF EXISTS resumes;
