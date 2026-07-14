-- ==============================================================================
-- 008_resume_versions.sql
-- Table to store tailored versions of resumes optimized for specific jobs
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS resume_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    original_resume_id UUID NOT NULL REFERENCES resume_profiles(resume_id) ON DELETE CASCADE,
    target_job_id UUID NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    
    -- Version Details
    version_number INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'OPTIMIZED', -- OPTIMIZED, REJECTED, VALIDATION_FAILED
    
    -- Data
    tailored_resume_data JSONB NOT NULL,
    change_log JSONB,
    validation_report JSONB,
    
    -- Scoring History
    ats_score_before INTEGER NOT NULL,
    ats_score_after INTEGER NOT NULL,
    improvement_percentage NUMERIC(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN ats_score_before = 0 THEN 0 
            ELSE ((ats_score_after - ats_score_before)::NUMERIC / ats_score_before::NUMERIC) * 100 
        END
    ) STORED,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resume_versions_user ON resume_versions(user_id);
CREATE INDEX idx_resume_versions_job ON resume_versions(target_job_id);

COMMIT;
