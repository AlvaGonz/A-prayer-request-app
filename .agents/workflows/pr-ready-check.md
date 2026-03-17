---
description: Runs lint, build and smoke checks before opening a Pull Request to develop
---

You are preparing a PR for the Prayer Board PWA.
Target branch: develop

STEP 1 — Confirm current branch is NOT main or develop. 
  If it is, stop and warn the user.

STEP 2 — Run lint:
  cd prayer-board && npm run lint
  If errors → show them, stop. Do NOT proceed until lint passes.

STEP 3 — Run build:
  cd prayer-board && npm run build
  If build fails → show error, stop.

STEP 4 — Run backend syntax check:
  cd prayer-board/server && node --check server.js
  If fails → show error, stop.

STEP 5 — Run tests (if test script is configured):
  cd prayer-board && npm test --if-present
  cd prayer-board/server && npm test --if-present

STEP 6 — If all pass, output PR checklist:
  ✅ Lint passed
  ✅ Build passed  
  ✅ Backend syntax valid
  ✅ Tests passed (or skipped)
  
  Branch: [current branch]
  → Ready to open PR to develop
  → PR title must follow: feat/fix/refactor/chore: description