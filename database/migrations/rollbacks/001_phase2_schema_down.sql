-- ============================================================================
-- Phase 2: Core Platform Schema Rollback
-- ============================================================================

DROP TRIGGER IF EXISTS set_timestamp_user_settings ON user_settings;
DROP TRIGGER IF EXISTS set_timestamp_profiles ON profiles;
DROP TRIGGER IF EXISTS set_timestamp_users ON users;
DROP FUNCTION IF EXISTS trigger_set_timestamp();

DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;
