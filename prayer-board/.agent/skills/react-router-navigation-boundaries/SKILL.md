---
description: Plan React Router navigation boundaries, loaders, and fallbacks for Prayer Board.
---
# react-router-navigation-boundaries

**Purpose:** Architect routing, public/auth route separation, shared routes, and route-level fallback/error handling.
**When to Use:** When adding new pages, nested routes, or changing access control (auth vs public).
**Project-Specific Use Cases:**
- Auth routes (login/register) vs protected Prayer Wall routes.
- Shared prayer page accessible by guests.
- Route-level fallback/error handling for missing prayers.
- Route plan clarity before configuring routers.

**Inputs:** Page flow diagrams, authentication requirements.
**Outputs:** Route maps, security boundaries, and fallback component designs.

## Hard Rules
- **Strict Grounding:** Use ONLY https://reactrouter.com/home as the authoritative source. Do not invent APIs or undocumented behaviors.
- **Transparency:** Separate facts, assumptions, and open questions in all plans.
- **Branching Required:** Every implementation-oriented example or action must require a new git branch for each new feature.

## Failure Conditions
- Mixing protected logic in public route layers without clear boundaries.
- Missing route-level error boundaries or fallback elements.
- Failing to separate assumed router behavior from confirmed v6/v7 facts.

## Expected Artifacts
- route-map.md
- boundary-fallback.md

## Example Invocation
"Plan the routing boundaries for the new Shared Prayer public page."
