---
name: web-quality-audit
description: Comprehensive web quality audit covering performance, accessibility, SEO, and best practices. Use when asked to "audit my site", "review web quality", "run lighthouse audit", "check page quality", or "optimize my website".
license: MIT
metadata:
 author: web-quality-skills
 version: "1.0"
---

# Web quality audit

Comprehensive quality review based on Google Lighthouse audits. Covers Performance, Accessibility, SEO, and Best Practices across 150+ checks.

## How it works

1. Analyze the provided code/project for quality issues
2. Categorize findings by severity (Critical, High, Medium, Low)
3. Provide specific, actionable recommendations
4. Include code examples for fixes

## Audit categories

### Performance (40% of typical issues)

**Core Web Vitals** — Must pass for good page experience:
\* **LCP (Largest Contentful Paint) < 2.5s.** The largest visible element must render quickly. Optimize images, fonts, and server response time.
\* **INP (Interaction to Next Paint) < 200ms.** User interactions must feel instant. Reduce JavaScript execution time and break up long tasks.
\* **CLS (Cumulative Layout Shift) < 0.1.** Content must not jump around. Set explicit dimensions on images, embeds, and ads.

**Resource Optimization:**
\* **Compress images.** Use WebP/AVIF with fallbacks. Serve correctly sized images via `srcset`.
\* **Minimize JavaScript.** Remove unused code. Use code splitting. Defer non-critical scripts.
\* **Optimize CSS.** Extract critical CSS. Remove unused styles. Avoid `@import`.
\* **Efficient fonts.** Use `font-display: swap`. Preload critical fonts. Subset to needed characters.

**Loading Strategy:**
\* **Preconnect to origins.** Add `<link rel="preconnect">` for third-party domains.
\* **Preload critical assets.** LCP images, fonts, and above-fold CSS.
\* **Lazy load below-fold content.** Images, iframes, and heavy components.
\* **Cache effectively.** Long cache TTLs for static assets. Immutable caching for hashed files.

### Accessibility (30% of typical issues)

**Perceivable:**
\* **Text alternatives.** Every `<img>` has meaningful `alt` text. Decorative images use `alt=""`.
\* **Color contrast.** Minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA).
\* **Don't rely on color alone.** Use icons, patterns, or text alongside color indicators.
\* **Captions and transcripts.** Video has captions. Audio has transcripts.

**Operable:**
\* **Keyboard accessible.** All functionality available via keyboard. No keyboard traps.
\* **Focus visible.** Clear focus indicators on all interactive elements.
\* **Skip links.** Provide "Skip to main content" for keyboard users.
\* **Sufficient time.** Users can extend time limits. No auto-advancing content without controls.

**Understandable:**
\* **Page language.** Set `lang` attribute on `<html>`.
\* **Consistent navigation.** Same navigation structure across pages.
\* **Error identification.** Form errors clearly described and associated with fields.
\* **Labels and instructions.** All form inputs have associated labels.

**Robust:**
\* **Valid HTML.** No duplicate IDs. Properly nested elements.
\* **ARIA used correctly.** Prefer native elements. ARIA roles match behavior.
\* **Name, role, value.** Interactive elements have accessible names and correct roles.

### SEO (15% of typical issues)

**Crawlability:**
\* **Valid robots.txt.** Doesn't block important resources.
\* **XML sitemap.** Lists all important pages. Submitted to Search Console.
\* **Canonical URLs.** Prevent duplicate content issues.
\* **No noindex on important pages.** Check meta robots and headers.

**On-Page SEO:**
\* **Unique title tags.** 50-60 characters. Primary keyword included.
\* **Meta descriptions.** 150-160 characters. Compelling and unique.
\* **Heading hierarchy.** Single `<h1>` per page. Logical structure.
\* **Image optimization.** Descriptive filenames, alt text, compressed.

### Best Practices (15% of typical issues)

**Security:**
\* **HTTPS everywhere.** All resources served over HTTPS.
\* **Secure cookies.** HttpOnly, Secure, SameSite flags.
\* **Content Security Policy.** Restrict resource loading.
\* **No vulnerable libraries.** Regular dependency audits.
\* **Input sanitization.** Prevent XSS and injection attacks.

**Code Quality:**
\* **Valid HTML.** Passes W3C validator.
\* **No console errors.** Clean production builds.
\* **Feature detection.** Not browser detection.
\* **Modern APIs.** No deprecated features.

---

## Severity levels

### Critical — Fix immediately
- Security vulnerabilities (XSS, CSRF)
- Missing accessibility (no labels, no focus)
- Performance blocking (render-blocking resources)
- Broken functionality

### High — Fix before launch
- Poor Core Web Vitals
- Missing SEO basics (title, description)
- Color contrast failures
- Keyboard navigation issues

### Medium — Fix soon
- Missing alt text
- Unoptimized images
- Missing structured data
- Console warnings

### Low — Nice to have
- Minor optimizations
- Code style issues
- Non-critical enhancements

---

## Quick audit commands

### Lighthouse CLI

```bash
# Full audit
npx lighthouse https://example.com --output=html --output-path=report.html

# Specific categories
npx lighthouse https://example.com --only-categories=performance,accessibility

# Mobile simulation
npx lighthouse https://example.com --preset=desktop
```

### axe-core

```bash
# Accessibility audit
npm install @axe-core/cli -g
axe https://example.com

# Output to file
axe https://example.com --save results.json
```

### Web Vitals

```bash
# Measure Core Web Vitals
npm install web-vitals

# In your code:
import {onLCP, onINP, onCLS} from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

---

## Sample audit report structure

When conducting an audit, organize findings like this:

```markdown
# Web Quality Audit — [Project Name]

## Executive Summary
- Overall Score: 78/100
- Critical Issues: 3
- High Priority: 7
- Medium Priority: 12

## Performance (Score: 72)

### Critical
1. **LCP too slow (4.2s)**
   - Impact: Poor user experience, affects SEO
   - Fix: Preload hero image, compress to WebP
   - Code: `<link rel="preload" as="image" href="hero.webp">`

### High
2. **Render-blocking JavaScript**
   - Impact: Delays first contentful paint
   - Fix: Add `defer` or `async` attributes
   - Code: `<script src="app.js" defer></script>`

## Accessibility (Score: 85)
[...]

## Recommendations Priority
1. Fix LCP (Critical)
2. Add missing alt text (High)
3. Optimize images (High)
4. [etc]
```

---

## References

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Google Search Guidelines](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Security Best Practices](https://web.dev/secure/)

---

## Scripts

See the `scripts/` directory for automation tools:

- `analyze.sh` — Basic HTML quality scanner
