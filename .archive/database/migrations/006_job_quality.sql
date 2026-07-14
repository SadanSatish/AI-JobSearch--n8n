-- ==============================================================================
-- 006_job_quality.sql
-- Adds quality tracking columns for ghost jobs, scams, and opportunity classification
-- ==============================================================================

BEGIN;

-- Add quality columns to the jobs table
ALTER TABLE jobs
    ADD COLUMN IF NOT EXISTS ghost_probability INTEGER DEFAULT 0 CHECK (ghost_probability >= 0 AND ghost_probability <= 100),
    ADD COLUMN IF NOT EXISTS scam_risk INTEGER DEFAULT 0 CHECK (scam_risk >= 0 AND scam_risk <= 100),
    ADD COLUMN IF NOT EXISTS link_status VARCHAR(50) DEFAULT 'UNVERIFIED', -- VALID, BROKEN, TIMEOUT, UNVERIFIED
    ADD COLUMN IF NOT EXISTS classification VARCHAR(50) DEFAULT 'PENDING', -- APPLY_IMMEDIATELY, GOOD_MATCH, REJECT, etc.
    ADD COLUMN IF NOT EXISTS quality_report JSONB,
    ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- Add verification columns to companies table
ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'UNVERIFIED', -- VERIFIED, SUSPICIOUS, UNVERIFIED
    ADD COLUMN IF NOT EXISTS company_health_score INTEGER;

-- Create index for quick filtering of viable jobs
CREATE INDEX IF NOT EXISTS idx_jobs_classification ON jobs(classification) WHERE classification != 'REJECT';

COMMIT;
