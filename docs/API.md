# Backend API Documentation

## Authentication (`/api/v1/auth`)
- `POST /register`
  - Body: `{ "email": "...", "password": "..." }`
- `POST /login`
  - Body: `{ "email": "...", "password": "..." }`
  - Returns `accessToken` (JWT), sets `refreshToken` HttpOnly cookie.
- `POST /logout`
  - Clears `refreshToken` cookie.

## Users (`/api/v1/users`)
- `GET /profile`
  - Requires: `Authorization: Bearer <token>`

## System (`/api/v1/system`)
- `GET /health`
- `GET /version`
