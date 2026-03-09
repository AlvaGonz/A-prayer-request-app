# Examples for tanstack-query-server-state

## Invocation 1
**User:** "Design the TanStack Query strategy for optimistically adding a comment on a prayer request."
**Agent:** Creates `optimistic-mutation.md` specifying the `onMutate`, `onError`, and `onSettled` callbacks to handle cache rollback. Reminds User to checkout a new branch.

## Invocation 2
**User:** "Plan the query keys and cache policy for the Prayer Wall feed."
**Agent:** Generates `query-strategy.md` defining `['requests', { status: 'pending' }]` and configures `staleTime` to balance feed freshness against network requests.

## Invocation 3
**User:** "How should we implement pagination for the wall feed?"
**Agent:** Drafts `query-strategy.md` using `useInfiniteQuery` concepts based directly on TanStack documentation, separating facts from assumptions about the backend cursor format.
