# Task Plan: Integrate RippleButton Component

## Project Analysis

### Current State
- **Language**: JavaScript (JSX), NOT TypeScript
- **Styling**: Vanilla CSS with CSS variables, NOT Tailwind CSS
- **Build Tool**: Vite
- **No shadcn/ui setup**
- **No `@/lib/utils` or `cn` utility**

### Required Setup (Since project doesn't use TS/Tailwind)
1. Convert TypeScript component to JavaScript
2. Create `cn` utility function for className merging
3. Add rippling animation to existing CSS
4. Create RippleButton component using project's CSS variables

## Implementation Steps

### Step 1: Create Utility Function
- Create `src/lib/utils.js` with `cn` function using simple string concatenation

### Step 2: Create RippleButton Component
- Convert TSX to JSX
- Adapt styling to use project's CSS variables (--color-*, --radius-*)
- Add rippling effect with gold accent color

### Step 3: Add Animation to CSS
- Add `rippling` keyframes to `index.css`
- Add `.animate-rippling` class

### Step 4: Button Overhaul - Create New Components

#### 4.1 Create `RipplePrayedButton.jsx`
- Replace existing PrayedButton with ripple effect
- Keep all existing functionality (localStorage, optimistic updates, etc.)
- Use RippleButton as base

#### 4.2 Create `RippleCommentButton.jsx`
- New component for comments toggle
- Use RippleButton with MessageCircle icon

#### 4.3 Create `RippleShareButton.jsx`
- New component for sharing
- Use RippleButton with Share icon

#### 4.4 Create `RippleMarkAnsweredButton.jsx`
- New component for marking prayers as answered
- Use RippleButton with CheckCircle2 icon

### Step 5: Update PrayerRequestCard.jsx
- Replace all existing buttons with new Ripple versions
- Update imports
- Keep all existing logic

### Step 6: Update CSS
- Create `RippleButton.css` with component styles
- Update `PrayerRequestCard.css` for new button layout
- Ensure touch targets remain ≥44px

## Files to Create/Modify

### New Files:
1. `src/lib/utils.js` - cn utility
2. `src/components/ui/RippleButton.jsx` - Base ripple component
3. `src/components/ui/RippleButton.css` - Component styles
4. `src/components/RipplePrayedButton.jsx` - Prayed button with ripple
5. `src/components/RippleCommentButton.jsx` - Comment button with ripple
6. `src/components/RippleShareButton.jsx` - Share button with ripple
7. `src/components/RippleMarkAnsweredButton.jsx` - Mark answered with ripple

### Modified Files:
1. `src/index.css` - Add rippling animation
2. `src/components/PrayerRequestCard.jsx` - Use new button components
3. `src/components/PrayerRequestCard.css` - Update button styles

## Design Decisions

### Ripple Color
- Use `--color-accent-gold` (the project's gold accent) for ripples
- This maintains the reverent, warm aesthetic

### Button Styling
- Use existing CSS variables for consistency:
  - `--color-bg-card` for background
  - `--color-border` for borders
  - `--color-text-primary` for text
  - `--radius-md` for border radius
- Keep height at 52px (exceeds 44px touch target)

### Animation Duration
- 600ms for ripple effect (matches the provided component)
