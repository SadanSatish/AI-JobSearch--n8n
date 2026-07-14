# Authentication & Security

## Architecture
- **Password Hashing**: `argon2`
- **Session Strategy**: Dual JWT tokens.
  - Access Token (15 min expiry, returned in JSON payload).
  - Refresh Token (7 day expiry, stored securely in HTTP-Only, SameSite cookie and hashed in the `sessions` table).
- **Protection**:
  - `helmet` sets strict HTTP security headers.
  - `express-rate-limit` throttles login endpoints and global APIs.
  - Parameterized queries prevent SQL injection via `pg`.
