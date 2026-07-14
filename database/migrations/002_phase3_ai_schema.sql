-- ============================================================================
-- Phase 3: AI Intelligence Layer Schema
-- ============================================================================

-- ============================================================================
-- 1. Resumes
-- ============================================================================
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_url TEXT NOT NULL,
    raw_text TEXT,
    parsed_data JSONB, -- Structured JSON extracted by AI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- ============================================================================
-- 2. Resume Versions (Optimization History)
-- ============================================================================
CREATE TABLE IF NOT EXISTS resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    optimized_data JSONB NOT NULL,
    prompt_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);

-- ============================================================================
-- 3. Job Descriptions
-- ============================================================================
CREATE TABLE IF NOT EXISTS job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    raw_text TEXT NOT NULL,
    parsed_data JSONB, -- Structured JD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);

-- ============================================================================
-- 4. ATS Results
-- ============================================================================
CREATE TABLE IF NOT EXISTS ats_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_description_id UUID NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
    overall_score NUMERIC(5, 2) NOT NULL,
    keyword_match_score NUMERIC(5, 2),
    skill_match_score NUMERIC(5, 2),
    experience_score NUMERIC(5, 2),
    semantic_similarity_score NUMERIC(5, 2),
    gap_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ats_results_resume_id ON ats_results(resume_id);
CREATE INDEX idx_ats_results_jd_id ON ats_results(job_description_id);

-- ============================================================================
-- 5. Embeddings Metadata
-- ============================================================================
-- The actual vectors live in Qdrant, but we store references here.
CREATE TABLE IF NOT EXISTS embeddings_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type VARCHAR(50) NOT NULL, -- 'resume' or 'job_description'
    resource_id UUID NOT NULL,          -- links to resumes.id or job_descriptions.id
    qdrant_point_id UUID NOT NULL,      -- UUID in Qdrant
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_embeddings_metadata_resource ON embeddings_metadata(resource_type, resource_id);

-- ============================================================================
-- Update Timestamp Triggers
-- ============================================================================
CREATE TRIGGER set_timestamp_resumes
BEFORE UPDATE ON resumes
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_job_descriptions
BEFORE UPDATE ON job_descriptions
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
