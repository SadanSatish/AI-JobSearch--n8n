-- ==============================================================================
-- 011_production_indexes.sql
-- Performance optimization for read-heavy API endpoints
-- ==============================================================================

BEGIN;

-- 1. Indexing dedup_hash for ultra-fast duplicate job prevention (Phase 4/8)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_dedup_hash ON jobs USING HASH (dedup_hash);

-- 2. Indexing classification and match_score for the Opportunities API (Phase 9)
-- B-Tree index allows fast sorting and filtering for the dashboard feed
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_classification_score ON jobs (classification, match_score DESC);

-- 3. Foreign Key Indexes to prevent sequential scans on cascading deletes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resume_profiles_user ON resume_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_resume_versions_original ON resume_versions(original_resume_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ats_evaluations_job ON ats_evaluations(job_id);

-- 4. Indexing Application Follow-ups for the Notification Agent (Phase 9)
-- Partial index: only index SUBMITTED applications for ultra-fast daily cron evaluation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_apps_followup_date 
ON applications (follow_up_date) 
WHERE status = 'SUBMITTED';

COMMIT;
