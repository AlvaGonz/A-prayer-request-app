# Findings: Answered Flow Investigation

## Backend
- Route: `PATCH /api/requests/:id/answer`
- Controller: `markAnswered` in `requestController.js`
- Logic: Sets `status = 'answered'`, saves `testimony`, `answeredAt`, and `answeredBy`.
- Constraint: Only the author can mark it as answered.

## Frontend
- Component: `PrayerRequestCard.jsx`
- Interaction: 
    - "Mark Answered" button visible if `isAuthor && !isAnswered`.
    - Shows a `textarea` for testimony.
    - Saves via `markAnsweredMutation.mutate`.
- UI: Uses a `CheckCircle2` icon.

## Tabs
- Need to check `PrayerWallPage.jsx` to see how "Pending" vs "Answered" tabs work.
