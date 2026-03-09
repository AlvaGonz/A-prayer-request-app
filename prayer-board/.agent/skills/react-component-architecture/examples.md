# Examples for react-component-architecture

## Invocation 1
**User:** "Design the component architecture for the new Prayer Wall feed, minimizing prop drilling."
**Agent:** Creates `component-spec.md` detailing the `<PrayerFeed />` and `<PrayerCard />` boundaries, and `composition-plan.md` showing how to pass children to avoid prop drilling. Ensure facts/assumptions are separated.

## Invocation 2
**User:** "Plan the state management for the comment section on a prayer request."
**Agent:** Drafts `composition-plan.md` explaining local state `[draft, setDraft]` inside `<CommentInput />` and lifted state or server state for the comments list. Mentions creating a new git branch before implementing.

## Invocation 3
**User:** "Refactor the Shared Prayer Page to improve component composition."
**Agent:** Updates `component-spec.md` with the new boundaries and uses `composition-plan.md` to document the structural changes based on react.dev guidelines.
