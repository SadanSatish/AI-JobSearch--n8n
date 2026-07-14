-- ==============================================================================
-- 007_ats_intelligence.sql
-- Table to store ATS Evaluation records linking users, resumes, and jobs
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS ats_evaluations (
    evaluation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES resume_profiles(resume_id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    
    -- Scores
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    skill_match_score INTEGER NOT NULL DEFAULT 0,
    experience_match_score INTEGER NOT NULL DEFAULT 0,
    semantic_match_score INTEGER NOT NULL DEFAULT 0,
    
    -- JSON Data
    keyword_density JSONB,
    gap_analysis JSONB,
    recommendations JSONB,
    
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure we only have one current evaluation per resume+job combo
    CONSTRAINT unique_resume_job_eval UNIQUE (resume_id, job_id)
);

CREATE INDEX idx_ats_evaluations_resume ON ats_evaluations(resume_id);
CREATE INDEX idx_ats_evaluations_job ON ats_evaluations(job_id);
CREATE INDEX idx_ats_evaluations_score ON ats_evaluations(overall_score DESC);

COMMIT;
