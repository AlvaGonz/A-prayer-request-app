---
description: Verifies all translation keys are present in both EN and ES, and no forbidden words exist
---

Read these files:
@prayer-board/src/i18n/en/translation.json
@prayer-board/src/i18n/es/translation.json

STEP 1 — Compare keys: every key in EN must exist in ES and vice versa.
  List any missing keys.

STEP 2 — Scan ES translation file for forbidden words:
  "rezo", "rezar", "rezando", "rece"
  If found → list them with their key names.

STEP 3 — Scan ALL .jsx files in @prayer-board/src/ for hardcoded 
  Spanish strings (text not using t() from react-i18next).
  Flag any found.

Output:
  ✅ Keys in sync: YES/NO — list missing if any
  ✅ No forbidden words: YES/NO — list found if any
  ✅ No hardcoded ES strings: YES/NO — list found if any