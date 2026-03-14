# Adversarial Security Audit — Task Plan

## Overview
Apply 5 adversarial hardening fixes to reduce attack surface against motivated adversaries.

---

## Checklist

### ADV-001: JWT Expiry Reduction + Algorithm Hardening
- [ ] Change JWT expiry from `30d` to `1d` in authController.js
- [ ] Add explicit `algorithm: 'HS256'` to jwt.sign
- [ ] Add `algorithms: ['HS256']` to jwt.verify in middleware/auth.js protect()
- [ ] Add `algorithms: ['HS256']` to jwt.verify in middleware/auth.js optionalAuth()

### ADV-002: CSP Enforcement (reportOnly → enforce)
- [ ] Remove `reportOnly: true` from helmet CSP config
- [ ] Add additional Helmet options (HSTS, referrerPolicy, xFrameOptions)

### ADV-003: CSP Remove unsafe-inline
- [ ] Remove `'unsafe-inline'` from script-src directive
- [ ] Add additional CSP directives (frame-src, object-src, base-uri, form-action)
- [ ] Update connect-src to include API domains explicitly

### ADV-004: Body Size Limit Reduction
- [ ] Change express.json limit from `10mb` to `50kb`
- [ ] Change express.urlencoded limit from `10mb` to `50kb`

### ADV-005: CORS No-Origin Request Restriction
- [ ] Modify CORS origin callback to reject no-origin requests in production
- [ ] Allow no-origin only in development mode (for Postman/curl testing)

### ADV-006: Request ID Middleware for Audit Trail
- [ ] Import `randomUUID` from crypto module
- [ ] Add request ID middleware before health check route
- [ ] Update error handler to include request ID in logs
- [ ] Set X-Request-ID response header

### Documentation
- [ ] Update findings.md with audit results
- [ ] Update progress.md with session log

---

## Constraints
- Do NOT change route signatures or response shapes
- Do NOT add new npm packages (crypto is built-in)
- Do NOT enable credentials: true on CORS
- Do NOT touch frontend code
