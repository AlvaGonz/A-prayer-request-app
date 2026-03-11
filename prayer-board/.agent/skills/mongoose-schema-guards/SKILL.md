---
description: Workspace-local skill for mongoose-schema-guards tailored to Prayer Board.
---

# mongoose-schema-guards

**Purpose:** Provide strict, grounded conventions for mongoose-schema-guards logic.
**When to Use:** When configuring, refactoring, or building mongoose-schema-guards elements.
**Inputs:** Existing codebase state, new feature requirements.
**Outputs:** Checklists, code patterns, and validation plans.

## Grounding Source
https://mongoosejs.com/docs/guide.html

## Project-Specific Use Cases
- Schema shape control
- strict and strictQuery policy
- Validation before save
- Safe query filter construction
- Index planning
- Virtuals/toJSON behavior
- optimisticConcurrency where needed
- Production-minded autoIndex guidance

## Hard Rules
- Use ONLY the official Mongoose schema docs above.
- Do not invent model conventions or plugin behavior not grounded in the docs.
- Explicitly include guardrails for strict, strictQuery, validation, query filter safety, indexes, and optimistic concurrency.
- Include the documented warning against passing user-defined objects directly into query filters.
- Tailor examples to prayer requests, comments, users, and reaction counters.
- Every implementation example must require a new git branch for each new feature.
- Separate facts, assumptions, and open questions explicitly.

## Failure Conditions
- Ignoring the official documentation boundaries.
- Failing to create a git branch prior to implementation.
- Utilizing hallucinated API properties or frameworks.

## Expected Artifacts
- schema-review.md\n- query-safety-checklist.md

## Example Invocation
"Apply the mongoose-schema-guards skill to safely implement the upcoming update."
