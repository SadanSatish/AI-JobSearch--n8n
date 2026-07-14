# Database Schema

## Tables
1. **users**: Core authentication logic and RBAC.
2. **profiles**: Non-sensitive user data.
3. **user_settings**: App preferences & feature flags per user.
4. **sessions**: Refresh token hashes for valid active sessions.
5. **api_keys**: For API-to-API programmatic access.
6. **activity_logs** / **audit_logs**: Immutable logs for actions and data mutations.
7. **system_settings**: Global app configuration.
