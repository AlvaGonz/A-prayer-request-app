---
description: Workspace-local skill for express-api-hardening tailored to Prayer Board.
---

# express-api-hardening

**Purpose:** Provide strict, grounded conventions for express-api-hardening logic.
**When to Use:** When configuring, refactoring, or building express-api-hardening elements.
**Inputs:** Existing codebase state, new feature requirements.
**Outputs:** Checklists, code patterns, and validation plans.

## Grounding Source
https://expressjs.com/en/guide/routing.html

## Project-Specific Use Cases
- Route method boundaries
- Middleware ordering
- Modular routers with express.Router()
- next() discipline in multi-callback chains
- Route param handling
- Express 5 route-path cautions
- Consistent response termination

## Hard Rules
- Use ONLY the official Express routing docs above.
- Do not invent middleware semantics or unsupported routing patterns.
- Emphasize app.METHOD(), app.use(), app.all(), express.Router(), next(), req.params, and response completion.
- Include Express 5 cautions around path matching and route patterns.
- Tailor examples to prayer requests, comments, auth, and shared-link endpoints.
- Every implementation example must require a new git branch for each new feature.
- Separate facts, assumptions, and open questions explicitly.

## Failure Conditions
- Ignoring the official documentation boundaries.
- Failing to create a git branch prior to implementation.
- Utilizing hallucinated API properties or frameworks.

## Expected Artifacts
- route-contract.md\n- middleware-order-checklist.md

## Example Invocation
"Apply the express-api-hardening skill to safely implement the upcoming update."
