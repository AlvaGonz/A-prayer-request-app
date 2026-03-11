---
description: Crea una rama nueva para un feature, valida el nombre y prepara el contexto del proyecto
---

You are working on the Prayer Board PWA monorepo.
Structure: prayer-board/src (frontend) | prayer-board/server (backend)
Active branches convention: feat/*, fix/*, refactor/*, chore/*, security/*, perf/*, test/*

STEP 1 — Ask the user: "What is the feature name? (will become feat/[name])"
STEP 2 — Validate the name: lowercase, hyphens only, no spaces.
STEP 3 — Run: git checkout develop && git pull origin develop
STEP 4 — Run: git checkout -b feat/[name]
STEP 5 — Confirm branch was created and output:
  - Branch: feat/[name]
  - Base: develop
  - Next: implement the feature, then run /commit-feature when done