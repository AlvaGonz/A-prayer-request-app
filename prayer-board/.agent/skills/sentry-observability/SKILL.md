---
description: Workspace-local skill for sentry-observability tailored to Prayer Board.
---

# sentry-observability

**Purpose:** Provide strict, grounded conventions for sentry-observability logic.
**When to Use:** When configuring, refactoring, or building sentry-observability elements.
**Inputs:** Existing codebase state, new feature requirements.
**Outputs:** Checklists, code patterns, and validation plans.

## Grounding Source
https://docs.sentry.io/platforms/javascript/guides/react/

## Project-Specific Use Cases
- SPA initialization for Vite
- Import instrumentation before app entry
- React 19 error handling
- Error boundaries
- React Router tracing
- Sourcemaps for production debugging
- Verification flow for setup

## Hard Rules
- Use ONLY the official Sentry React docs above.
- Prefer minimal viable setup first: issues + error capture + sourcemaps.
- Mention React 19 root error hooks and React Router integration.
- Tailor verification steps to Prayer Board.
- Every implementation example must require a new git branch for each new feature.
- Separate facts, assumptions, and open questions explicitly.

## Failure Conditions
- Ignoring the official documentation boundaries.
- Failing to create a git branch prior to implementation.
- Utilizing hallucinated API properties or frameworks.

## Expected Artifacts
- instrumentation-plan.md\n- release-debug-checklist.md

## Example Invocation
"Apply the sentry-observability skill to safely implement the upcoming update."
