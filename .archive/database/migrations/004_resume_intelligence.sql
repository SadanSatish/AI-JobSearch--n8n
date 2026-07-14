-- ==============================================================================
-- 004_resume_intelligence.sql
-- Adds Resume Uploads tracking and enhances Resume Profiles JSONB structure
-- ==============================================================================

BEGIN;

-- 1. Create resume_uploads table to track raw files and parsing status
CREATE TABLE IF NOT EXISTS resume_uploads (
    upload_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resume_profiles(resume_id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    text_hash VARCHAR(64) NOT NULL, -- SHA256 of extracted text for deduplication
    word_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'uploaded', -- uploaded, parsing, completed, failed
    error_message TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure user doesn't upload exact same resume twice blindly
    CONSTRAINT unique_user_resume_hash UNIQUE (user_id, text_hash)
);

-- Index for duplicate detection
CREATE INDEX idx_resume_uploads_hash ON resume_uploads(text_hash);

-- 2. Add columns to resume_profiles if they don't exist
ALTER TABLE resume_profiles 
    ADD COLUMN IF NOT EXISTS summary TEXT,
    ADD COLUMN IF NOT EXISTS location VARCHAR(255),
    ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS github_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS quality_score INTEGER,
    ADD COLUMN IF NOT EXISTS is_student BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS primary_domain VARCHAR(255),
    ADD COLUMN IF NOT EXISTS inferred_roles JSONB,
    ADD COLUMN IF NOT EXISTS parse_confidence INTEGER,
    ADD COLUMN IF NOT EXISTS parse_duration_ms INTEGER;

-- 3. Create a view for easy access to the full structured resume
CREATE OR REPLACE VIEW vw_resume_full AS
SELECT 
    rp.resume_id,
    rp.user_id,
    jsonb_build_object(
        'full_name', rp.full_name,
        'email', rp.email,
        'phone', rp.phone,
        'location', rp.location,
        'linkedin', rp.linkedin_url,
        'github', rp.github_url,
        'portfolio', rp.portfolio_url
    ) AS personal_info,
    rp.summary,
    rp.experience,
    rp.education,
    rp.projects,
    rp.certifications,
    rp.skills_matrix,
    rp.languages,
    jsonb_build_object(
        'inferred_roles', rp.inferred_roles,
        'experience_level', rp.seniority_level,
        'primary_domain', rp.primary_domain,
        'total_years_experience', rp.years_experience,
        'is_student', rp.is_student
    ) AS career_profile,
    jsonb_build_object(
        'score', rp.quality_score,
        'extracted_at', rp.parsed_at,
        'parse_confidence', rp.parse_confidence
    ) AS metadata
FROM resume_profiles rp;

COMMIT;
