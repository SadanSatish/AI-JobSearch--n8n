# Security Policies & Hardening

The application incorporates multiple layers of security to ensure data integrity and system stability.

## 1. Network & API Security
- **Helmet**: Secures Express apps by setting various HTTP headers (X-XSS-Protection, Strict-Transport-Security, etc).
- **CORS**: Strictly configured to only allow the production frontend URL (`process.env.FRONTEND_URL`) and `localhost` for development.
- **Rate Limiting**: 
  - Global Limiter: 100 requests per 15 minutes per IP.
  - Auth Limiter: 10 login requests per hour per IP (brute-force mitigation).

## 2. Authentication & Authorization
- **JWT**: Dual-token architecture (Access + Refresh tokens). Tokens are short-lived.
- **Argon2 / Bcrypt**: Passwords are securely hashed with salts before database insertion.
- **Role-based Access Control (RBAC)**: Admin routes are protected and automatically reject standard users.

## 3. Data Protection
- **Input Sanitization**: Every API endpoint uses `zod` for strict schema validation, mitigating SQL injection and XSS payload injections.
- **Connection Pooling**: PostgreSQL connections use a pool with a max size of 20 to prevent connection exhaustion under load.
- **SSL**: Production database connections force `rejectUnauthorized: false` for strict SSL transmission.

## 4. CI/CD Security
- `.dockerignore` prevents accidental leakage of `.env` files or Git histories into built Docker images.
- GitHub Actions automatically verifies build integrity before merges.
