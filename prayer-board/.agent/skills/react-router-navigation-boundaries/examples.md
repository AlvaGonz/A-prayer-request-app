# Examples for react-router-navigation-boundaries

## Invocation 1
**User:** "Plan the routing boundaries for the new Shared Prayer public page."
**Agent:** Generates `route-map.md` showing how `/prayer/:id/shared` sits outside the protected layout. Recommends creating a new feature branch before coding.

## Invocation 2
**User:** "Add route-level error handling for the Prayer Wall."
**Agent:** Creates `boundary-fallback.md` indicating the use of `ErrorBoundary` component from react-router to catch 404s or 500s when loading the feed.

## Invocation 3
**User:** "Restructure auth routes to prevent logged-in users from seeing the login page."
**Agent:** Drafts `route-map.md` to include a layout route that redirects authenticated users to `/wall`. Separates facts about `Navigate` from open questions about auth state.
