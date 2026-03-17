# Optimistic Mutation Plan

## Checkpoints
- [ ] New git branch created.

## Mutation Goal
[e.g., Add a comment instantly to the UI without waiting for server response]

## onMutate (Optimistic Update)
1. Cancel outgoing queries for `['entityKey', entityId]`.
2. Snapshot previous value using `queryClient.getQueryData()`.
3. Optimistically set active cache data using `queryClient.setQueryData()`.
4. Return context containing the snapshot.

## onError (Rollback)
- Revert cache to snapshot value using the returned context.

## onSettled (Invalidation)
- Invalidate queries for `['entityKey', entityId]` to sync exactly with the backend state.
