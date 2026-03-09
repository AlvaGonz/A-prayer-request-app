---
description: Quick adversarial review of backend inputs, JWT handling and rate limiting
---

You are auditing the Prayer Board PWA backend for security issues.

Read these files before starting:
@prayer-board/server/server.js
@prayer-board/server/routes/requests.js
@prayer-board/server/routes/auth.js
@prayer-board/server/routes/comments.js
@prayer-board/server/controllers/

CHECK 1 — Rate limiter order:
  Verify /api/health appears BEFORE app.use('/api', apiLimiter) in server.js.
  If not → flag it.

CHECK 2 — Input validation:
  For each controller that accepts req.body text fields:
  - Is there a trim() + length check?
  - Is sanitize-html applied before saving?
  Flag any controller that saves raw user input directly.

CHECK 3 — JWT error handling:
  Find jwt.verify() calls.
  Verify they are wrapped in try/catch.
  Verify the catch returns only { error: 'Unauthorized' }, not the JWT error.

CHECK 4 — Error handler:
  In server.js error middleware, verify err.stack is NOT exposed 
  when NODE_ENV === 'production'.

CHECK 5 — MongoDB ID validation:
  Find all req.params.id usages in controllers.
  Verify each one validates ObjectId before querying.

Output a report:
  ✅ PASS or ⚠️ FLAG for each check, with file + line reference.