# UX Audit Report — Prayer Board

> Generated: 2026-03-24
> Scope: All pages and components listed in CONTEXT

---

## CRITICAL FINDINGS

### 1. Design Token Misalignment
- **design_system.md** specifies `Playfair Display` + `Inter`, but user prompt says `Fira Code` + `Fira Sans`
- **Resolution:** Follow established codebase (Playfair Display + Inter) — these are already loaded and used everywhere
- **design_system.md** CTA is `#CA8A04` (gold), matching `--color-accent-gold: #ddb368` — NOT `#22C55E` (green)
- **Resolution:** Keep existing gold CTA. The accent-green tokens exist for secondary use

### 2. Hardcoded Hex Values (MUST FIX)
| File | Hex | Should Be |
|------|-----|-----------|
| `PrayerRequestCard.css:1-7` | `rgba(226, 185, 111, ...)` | Use `--gold-tint-*` vars (already defined) |
| `Header.css:89` | `rgba(0, 0, 0, 0.3)` box-shadow | Use `var(--color-shadow)` |
| `Header.css:134` | `rgba(226, 185, 111, 0.2)` | Reuse `--gold-tint-strong` |
| `PrayerWallPage.css:52` | `rgba(0, 0, 0, 0.3)` box-shadow | Use `var(--color-shadow)` |
| `PrayerWallPage.css:61` | `rgba(226, 185, 111, 0.4)` | Use gold tint variable |
| `PrayerWallPage.css:121` | `rgba(202, 138, 4, 0.25)` | Use gold tint variable |
| `AuthPages.css:58` | `rgba(248, 113, 113, 0.1)` | Use semantic error token |
| `AuthPages.css:159` | `rgba(226, 185, 111, 0.3)` | Use gold tint variable |
| `NewPrayerRequestForm.css:7` | `rgba(0, 0, 0, 0.7)` | Use overlay token |
| `NewPrayerRequestForm.css:88` | `rgba(226, 185, 111, 0.2)` | Use gold tint variable |
| `PrayerDetailModal.css:3` | `rgba(0, 0, 0, 0.7)` | Use overlay token |
| `PrayerDetailModal.css:16` | `rgba(0, 0, 0, 0.5)` box-shadow | Use shadow token |
| `PrayerRequestSkeleton.css:14` | `rgba(255, 255, 255, 0.05)` | Use skeleton token |
| `AnimatedCandle.jsx:33,78,84-86` | Hardcoded `#EAEAEA`, `#F5F5F5`, `#D4D4D4`, `#333`, `#FFF9E6`, `#FFAA00`, `#FFCC00`, `#FFEE88` | SVG internals — acceptable, these are decorative |
| `ProfilePage.jsx:226,234,246` | `rgba(226, 185, 111, 0.2)`, `rgba(226, 185, 111, 0.1)`, `#22c55e` | Move to tokens |
| `Header.css:161` | `rgba(248, 113, 113, 0.1)` | Use error tint token |

### 3. Missing `cursor-pointer`
| Element | File |
|---------|------|
| `.prayer-card` (whole card) | PrayerRequestCard.css — has it on hover only |
| `.filter-tab` | PrayerWallPage.css ✅ (has it) |
| `.error-banner button` | PrayerWallPage.css ✅ |
| `.auth-submit-btn` | AuthPages.css ✅ |
| `.toggle-password` | AuthPages.css ✅ |
| `.close-btn` | NewPrayerRequestForm.css ✅ |
| `.modal-close-btn` | PrayerDetailModal.css ✅ |
| `.identity-card` | NewPrayerRequestForm.css ✅ |
| `.read-more-btn` | PrayerRequestCard.css ✅ |
| `.action-btn` | PrayerRequestCard.css ✅ |

### 4. Missing/Weak Hover States
| Element | Issue |
|---------|-------|
| `.guest-link:hover` | Uses `rgba(255, 255, 255, 0.05)` — invisible in light mode |
| `.btn-ghost:hover` | Uses `rgba(255, 255, 255, 0.05)` — invisible in light mode |
| `.close-btn:hover` | Uses `rgba(255, 255, 255, 0.05)` — invisible in light mode |
| `.identity-card:hover` | Uses `rgba(255, 255, 255, 0.05)` — invisible in light mode |

### 5. Accessibility Gaps
| Issue | File |
|-------|------|
| **AnimatedCandle**: No `prefers-reduced-motion` guard on flame animations | AnimatedCandle.jsx |
| **PrayerRequestSkeleton**: No `prefers-reduced-motion` guard on shimmer | PrayerRequestSkeleton.css |
| **NotificationBanner**: Strings are hardcoded English, not i18n | NotificationBanner.jsx |
| **PrayerWallPage**: `loadingDot` animation has no reduced-motion guard | PrayerWallPage.css |
| **ProfilePage**: Inline `<style>` block — should be in CSS file | ProfilePage.jsx |
| **Wizard step indicator**: Uses `✓` emoji as checkmark — should use Lucide `Check` | NewPrayerRequestForm.jsx:227 |

### 6. Spacing Inconsistencies (not on 4px/8px grid)
| Element | Value | Should Be |
|---------|-------|-----------|
| `.header-container padding` | `16px 24px` | ✅ OK (multiples of 4/8) |
| `.wall-content padding` | `32px 24px` | ✅ OK |
| `.wall-filters gap` | `10px` | Should be `8px` or `12px` |
| `.prayer-card padding` | `20px` | Should be `24px` (8*3) or `16px` |
| `.auth-card padding` | `32px` | ✅ OK |
| `.modal-scroll-area padding` | `32px` | ✅ OK |
| `.wizard-steps gap` | `16px` | ✅ OK |
| `.comment-section-header gap` | implicit | Check |

### 7. Typography Issues
| Issue | File |
|-------|------|
| `.auth-card h1` missing `font-family: var(--font-heading)` | AuthPages.css |
| `.auth-logo` missing `font-family: var(--font-heading)` | AuthPages.css |
| Some heading elements may fall back to system fonts | Various |

### 8. Gradients & Shadows (Design System says Liquid Glass, not Flat)
The design_system.md specifies "Liquid Glass" style with morphing elements and dynamic blur.
However, the user's prompt explicitly requests **Flat Design (no shadows, no gradients)**.
**Resolution:** Follow the user's prompt. Remove gratuitous shadows and gradients where possible without breaking the existing dark/light theme visual quality.

### 9. Box Shadows to Remove/Reduce
| Element | Current Shadow | Action |
|---------|---------------|--------|
| `.auth-card` | `var(--shadow-lg)` | Keep — subtle, defined in theme |
| `.prayer-card` | `var(--shadow-sm)` | Keep — subtle |
| `.prayer-card:hover` | golden glow shadow | Consider removing |
| `.new-request-btn` | `0 4px 16px rgba(0,0,0,0.3)` | Remove or use token |
| `.user-avatar` | gradient background | Flatten to solid color |
| `.author-avatar` | double ring box-shadow | Consider simplifying |
| `.modal-avatar` | 4px ring box-shadow | Consider simplifying |
| `.dropdown-menu-content` | `0 10px 15px` | Use token |
| `.btn-primary:hover` | golden glow | Keep subtle |
| `.filter-tab.active` | golden glow | Consider removing |

---

## PRIORITY ORDER
1. ⬜ Add spacing/overlay tokens to `index.css`
2. ⬜ Replace hardcoded rgba values with CSS variables
3. ⬜ Fix light-mode hover states (transparent white → use theme-aware colors)
4. ⬜ Add `prefers-reduced-motion` guards
5. ⬜ Fix typography inheritance
6. ⬜ Move ProfilePage inline styles to CSS
7. ⬜ Replace emoji checkmark with Lucide icon
8. ⬜ Component-level polish
9. ⬜ Responsive audit
10. ⬜ i18n check
