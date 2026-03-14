## Adversarial Audit — 2026-03-13

### ADV-001 ✅ FIXED — JWT 30d → 1d + alg:HS256 explicit
**Risk:** Stolen 30-day token gives attacker 30 days of access. 1 day is industry standard.  
**Fix:**
- Changed expiry from `30d` to `1d` in authController.js
- Added explicit `algorithm: 'HS256'` to jwt.sign
- Added `algorithms: ['HS256']` to jwt.verify in middleware/auth.js (both protect and optionalAuth)

### ADV-002 ✅ FIXED — CSP reportOnly removed, now enforced
**Risk:** reportOnly: true logs violations but blocks nothing. XSS runs freely.  
**Fix:**
- Removed `reportOnly: true` from helmet CSP config
- Added HSTS with 1-year max-age, includeSubDomains, preload
- Added referrerPolicy: strict-origin-when-cross-origin
- Added xFrameOptions: deny for clickjacking protection

### ADV-003 ✅ FIXED — unsafe-inline removed from script-src
**Risk:** 'unsafe-inline' defeats CSP purpose entirely.  
**Fix:**
- Removed `'unsafe-inline'` from script-src directive
- Added additional CSP directives:
  - frame-src: ['none'] — prevents clickjacking via iframes
  - object-src: ['none'] — blocks Flash/plugin exploits
  - base-uri: ['self'] — prevents base tag injection
  - form-action: ['self'] — restricts form submission targets
- Updated connect-src to include API domains explicitly

### ADV-004 ✅ FIXED — Body limit 10mb → 50kb
**Risk:** 10MB JSON payloads allow body-bomb attacks (memory/CPU exhaustion).  
**Fix:**
- Changed express.json limit from `10mb` to `50kb`
- Changed express.urlencoded limit from `10mb` to `50kb`

### ADV-005 ✅ FIXED — CORS no-origin blocked in production
**Risk:** if (!origin) return true allows any server-to-server request to bypass CORS.  
**Fix:**
- Modified CORS origin callback to reject no-origin requests in production
- Allow no-origin in development and test modes (for Postman/curl/testing)

### ADV-006 ✅ FIXED — X-Request-ID on every request
**Risk:** Without request IDs, correlating security incidents across logs is impossible.  
**Fix:**
- Added Request ID middleware using crypto.randomUUID()
- Middleware sets X-Request-ID response header
- Error handler updated to include request ID in logs: `[Error] [request-id] message`

### REMAINING (out of scope / needs design decision):
- No refresh token rotation — when JWT expires, user re-logs in
  (acceptable for 1d expiry on a devotional app)
- No account lockout after N failed logins — rate limiter (5/15min)
  is the current mitigation; per-account lockout requires DB flag
- bcrypt rounds: currently uses 10 rounds (default), consider increasing to 12
