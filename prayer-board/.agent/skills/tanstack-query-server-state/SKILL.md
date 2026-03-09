---
description: Manage server state, caching, and optimistic updates using TanStack Query for Prayer Board.
---
# tanstack-query-server-state

**Purpose:** Design data fetching, cache freshness policies, mutations, optimistic updates, and invalidation strategies.
**When to Use:** When connecting React components to backend APIs, handling pagination, or building optimistic UI features.
**Project-Specific Use Cases:**
- Feed freshness (loading the Prayer Wall and cache policies).
- Optimistic interactions (liking/praying for a request).
- Comments fetching, pagination, and cached invalidation.
- Rollback strategies on failed mutations.

**Inputs:** API endpoint contracts, expected UI behavior.
**Outputs:** Query/Mutation strategies, cache key hierarchies.

## Hard Rules
- **Strict Grounding:** Use ONLY https://tanstack.com/query/latest/docs/framework/react/overview as the authoritative source. Do not invent APIs or undocumented behaviors.
- **Transparency:** Separate facts, assumptions, and open questions in all plans.
- **Branching Required:** Every implementation-oriented example or action must require a new git branch for each new feature.

## Failure Conditions
- Designing mutations without an `onMutate` rollback strategy for optimistic updates.
- Using random or unorganized query keys instead of a consistent array hierarchy.
- Confusing client state (Zustand/Context) with server state (TanStack Query).

## Expected Artifacts
- query-strategy.md
- optimistic-mutation.md

## Example Invocation
"Design the TanStack Query strategy for optimistically adding a comment on a prayer request."
