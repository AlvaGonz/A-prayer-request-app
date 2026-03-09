---
description: Stages, validates and commits current changes using conventional commits
---

You are on a feature branch of the Prayer Board PWA.

STEP 1 — Run: git status and show the user which files changed.
STEP 2 — Ask the user: "Describe what this commit does (one line)."
STEP 3 — Ask the user: "Type? (feat / fix / refactor / chore / security / perf / test)"
STEP 4 — Validate: message must not be empty, must be under 72 chars.
STEP 5 — Run: git add -A
STEP 6 — Run: git commit -m "[type]: [message]"
STEP 7 — Output the commit SHA and message.
STEP 8 — Ask: "Push to remote? (yes/no)"
  If yes → git push origin [current-branch]