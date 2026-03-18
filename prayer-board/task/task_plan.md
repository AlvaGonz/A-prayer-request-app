# Task Plan - Prayer Board

## Session: 2026-03-18

### BUG: CORS false-positive on Render health probes
- Status: FIXED
- Root cause: no-origin requests rejected in production
- Fix: allow no-origin (safe per browser CORS spec)

### BUG: Rate limiter broken on Render (SECURITY CRITICAL)
- Status: FIXED
- Root cause: trust proxy not set → ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
- Fix: app.set('trust proxy', 1) before all middleware
- Impact: brute force protection on /api/auth restored
