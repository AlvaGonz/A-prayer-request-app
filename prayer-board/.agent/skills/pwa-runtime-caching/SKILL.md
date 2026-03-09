---
description: Workspace-local skill for pwa-runtime-caching tailored to Prayer Board.
---

# pwa-runtime-caching

**Purpose:** Provide strict, grounded conventions for pwa-runtime-caching logic.
**When to Use:** When configuring, refactoring, or building pwa-runtime-caching elements.
**Inputs:** Existing codebase state, new feature requirements.
**Outputs:** Checklists, code patterns, and validation plans.

## Grounding Source
https://vite-pwa-org.netlify.app/guide/

## Project-Specific Use Cases
- Manifest and installability
- Service worker registration
- Offline experience
- Runtime caching behavior
- autoUpdate registration strategy
- Safe cache policy planning for API-backed feeds

## Hard Rules
- Use ONLY the official Vite PWA guide above.
- Focus on manifest, service worker, registration, and offline behavior.
- Tailor examples to Prayer Board wall feed and revisits.
- Do not invent plugin options not grounded in the docs.
- Every implementation example must require a new git branch for each new feature.
- Separate facts, assumptions, and open questions explicitly.

## Failure Conditions
- Ignoring the official documentation boundaries.
- Failing to create a git branch prior to implementation.
- Utilizing hallucinated API properties or frameworks.

## Expected Artifacts
- sw-strategy-map.md\n- offline-checklist.md

## Example Invocation
"Apply the pwa-runtime-caching skill to safely implement the upcoming update."
