-- ==============================================================================
-- 009_applications.sql
-- Table to track applications and generated application packages
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    resume_version_id UUID NOT NULL REFERENCES resume_versions(version_id) ON DELETE CASCADE,
    
    -- Status and Priority
    status VARCHAR(50) NOT NULL DEFAULT 'PREPARED', -- PREPARED, SUBMITTED, INTERVIEWING, REJECTED, WITHDRAWN
    priority_score INTEGER NOT NULL CHECK (priority_score >= 0 AND priority_score <= 100),
    priority_level VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- HIGH, MEDIUM, LOW
    
    -- Application Materials
    cover_letter TEXT,
    outreach_messages JSONB,
    
    -- Reminders
    follow_up_date DATE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Prevent exact duplicates for the same job and user
    CONSTRAINT unique_user_job_application UNIQUE (user_id, job_id)
);

CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_applications
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

COMMIT;
