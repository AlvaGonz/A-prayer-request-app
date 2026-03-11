# Task Plan: Theme Dropdown for Language Selection

## Project Analysis
- **Language**: JavaScript (JSX), NOT TypeScript
- **Styling**: Vanilla CSS with CSS custom properties (--color-*, --radius-*)
- **Existing UI Library**: Radix UI primitives already installed
- **Animation**: Framer Motion already installed

## Missing Dependencies to Install
1. `next-themes` - Theme management
2. `class-variance-authority` - Component variant utilities
3. `@radix-ui/react-tabs` - For tabs variant
4. `@radix-ui/react-radio-group` - For radio variant
5. `@radix-ui/react-slot` - Slot pattern for components

## Implementation Steps

### Step 1: Install Dependencies ✅
```bash
npm install next-themes class-variance-authority @radix-ui/react-tabs @radix-ui/react-radio-group @radix-ui/react-slot
```

### Step 2: Create Utility Files ✅
1. `src/lib/utils.js` - cn() function (already exists, verified)
2. `src/components/ui/tabs.jsx` - Radix Tabs wrapper
3. `src/components/ui/dropdown-menu.jsx` - Already exists, verified
4. `src/components/ui/radio-group.jsx` - Radix RadioGroup wrapper

### Step 3: Create Theme Component ✅
Create `src/components/ui/theme.jsx`:
- Convert TypeScript to JavaScript
- Replace Tailwind classes with CSS custom properties
- Support variants: dropdown, button
- Support sizes: sm, md, lg

### Step 4: Create Theme Dropdown Component ✅
Create `src/components/ui/theme-dropdown.jsx`:
- Wrapper component for language selection
- Use Theme component with variant="dropdown"
- Map languages: English, Español

### Step 5: Update LanguageSelector ✅
Replace current `<select>` with Theme dropdown

### Step 6: Create Demo Component ✅
Create `src/components/ui/theme-demo.jsx`:
- Showcase all Theme variants

## CSS Variable Mapping
| Tailwind | Project CSS Variable |
|----------|---------------------|
| bg-card | --color-bg-card |
| bg-muted | --color-bg-secondary |
| text-foreground | --color-text-primary |
| text-muted-foreground | --color-text-secondary |
| border | --color-border |
| primary | --color-accent-gold |
| ring-ring | --color-accent-gold |

## Language Configuration
```js
const languageConfigs = {
  en: { label: 'English', code: 'EN' },
  es: { label: 'Español', code: 'ES' }
};

const languageIcons = {
  en: Sun,  // Sun icon for English
  es: Moon  // Moon icon for Spanish
};
```

## Verification ✅ COMPLETE
- [x] Build succeeds (7.29s)
- [x] Visual test in browser ✅
  - Dropdown opens with animation
  - Language options display correctly
  - Language change works (EN → ES)
  - Icon changes (Sun → Moon)
  - Full i18n integration working

## Files Created
1. `src/components/ui/theme.jsx` - Main Theme component
2. `src/components/ui/theme.css` - Component styles
3. `src/components/ui/theme-dropdown.jsx` - Wrapper components
4. `src/components/ui/theme-demo.jsx` - Demo showcase
5. `src/components/ui/theme-demo.css` - Demo styles

## Files Modified
1. `src/components/LanguageSelector.jsx` - Uses new Theme dropdown
2. `src/components/LanguageSelector.css` - Simplified styles
3. `package.json` - Added dependencies

## Commit
`2c3f921` - feat: integrate Theme dropdown component for language selection
