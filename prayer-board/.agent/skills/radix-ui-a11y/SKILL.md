---
description: Workspace-local skill for radix-ui-a11y tailored to Prayer Board.
---

# radix-ui-a11y

**Purpose:** Provide strict, grounded conventions for radix-ui-a11y logic.
**When to Use:** When configuring, refactoring, or building radix-ui-a11y elements.
**Inputs:** Existing codebase state, new feature requirements.
**Outputs:** Checklists, code patterns, and validation plans.

## Grounding Source
https://www.radix-ui.com/primitives/docs/overview/introduction

## Project-Specific Use Cases
- Dialog usage for prayer forms
- Dropdown menu usage in headers
- Accessibility, focus management, keyboard navigation
- Unstyled primitives integrated with existing CSS
- Controlled vs uncontrolled adoption guidance

## Hard Rules
- Use ONLY the official Radix docs above.
- Preserve the project's CSS and visual identity.
- Emphasize WAI-ARIA alignment, keyboard support, and focus handling.
- Every implementation example must require a new git branch for each new feature.
- Separate facts, assumptions, and open questions explicitly.

## Failure Conditions
- Ignoring the official documentation boundaries.
- Failing to create a git branch prior to implementation.
- Utilizing hallucinated API properties or frameworks.

## Expected Artifacts
- dialog-checklist.md\n- a11y-audit.md

## Example Invocation
"Apply the radix-ui-a11y skill to safely implement the upcoming update."
