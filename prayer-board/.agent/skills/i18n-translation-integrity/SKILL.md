---
description: Workspace-local skill for i18n-translation-integrity tailored to Prayer Board.
---

# i18n-translation-integrity

**Purpose:** Provide strict, grounded conventions for i18n-translation-integrity logic.
**When to Use:** When configuring, refactoring, or building i18n-translation-integrity elements.
**Inputs:** Existing codebase state, new feature requirements.
**Outputs:** Checklists, code patterns, and validation plans.

## Grounding Source
https://www.i18next.com/

## Project-Specific Use Cases
- Translation key integrity
- Language detection expectations
- Translation loading strategy
- Namespace/file separation for scalability
- Interpolation, plurals, and context review
- Guardrails against hardcoded UI strings

## Hard Rules
- Use ONLY the official i18next docs above.
- Do not invent plugin behavior or framework-specific APIs not grounded in the docs.
- Emphasize key consistency, scalable file organization, language detection, translation loading, and open questions.
- Tailor examples to Prayer Board UI texts, notifications, auth screens, and prayer interaction strings.
- Every implementation example must require a new git branch for each new feature.
- Separate facts, assumptions, and open questions explicitly.

## Failure Conditions
- Ignoring the official documentation boundaries.
- Failing to create a git branch prior to implementation.
- Utilizing hallucinated API properties or frameworks.

## Expected Artifacts
- key-audit.md\n- translation-rollout.md

## Example Invocation
"Apply the i18n-translation-integrity skill to safely implement the upcoming update."
