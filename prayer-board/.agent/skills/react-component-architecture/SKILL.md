---
description: Design React component architecture, boundaries, and composition for Prayer Board.
---
# react-component-architecture

**Purpose:** Plan React component hierarchies focusing on page/component boundaries, lifted vs local state, composition, rendering lists, and avoiding prop drilling where possible.
**When to Use:** Before building new UI features or refactoring existing ones.
**Project-Specific Use Cases:**
- Architecting the Prayer Wall feed (rendering lists of prayers).
- Designing the comment section (local state for drafts, composition for list).
- Shared prayer page structure and layout boundaries.

**Inputs:** UI mockups, feature requirements, current component state.
**Outputs:** Component specifications, state placement decisions, and composition outlines.

## Hard Rules
- **Strict Grounding:** Use ONLY https://react.dev/ as the authoritative source. Do not invent APIs or undocumented behaviors.
- **Transparency:** Separate facts, assumptions, and open questions in all plans.
- **Branching Required:** Every implementation-oriented example or action must require a new git branch for each new feature.

## Failure Conditions
- Passing deeply nested props (prop drilling) without evaluating component composition or context.
- Mutating state directly instead of using setter functions or immutable updates.
- Failing to document assumptions about state boundaries.

## Expected Artifacts
- component-spec.md
- composition-plan.md

## Example Invocation
"Design the component architecture for the new Prayer Wall feed, minimizing prop drilling."
