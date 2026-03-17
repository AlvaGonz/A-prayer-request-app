# LCP optimization reference

## What is LCP?

Largest Contentful Paint (LCP) measures when the largest content element in the viewport becomes visible. This is typically:

- An `<img>` element
- An `<image>` element inside `<svg>`
- A `<video>` element with poster image
- An element with a background image via `url()`
- A block-level element containing text nodes

## LCP timeline

```
[ Server Response ][ Resource Load ][ Render ]
       TTFB           Download        Paint
  └─────────────────────────────────────┘
              LCP Time
```

## Detailed optimizations

### 1. Server response time (TTFB)

Target: < 800ms

**Causes:**
- Slow server/database queries
- No CDN/edge caching
- Inefficient backend code
- Cold starts (serverless)

**Solutions:**
```javascript
// Use edge functions for dynamic content
// Vercel example
export const config = { runtime: 'edge' };

// Use stale-while-revalidate caching
// Cache-Control header
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
```

### 2. Resource load time

**For images:**
```html
<!-- Preload LCP image -->
<link rel="preload" as="image" href="/hero.jpg" fetchpriority="high">

<!-- Modern formats with fallback -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" alt="Hero image" width="1200" height="600">
</picture>
```

**For text (web fonts):**
```css
@font-face {
  font-family: 'Heading';
  src: url('/fonts/heading.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
}
```

### 3. Render blocking resources

**Critical CSS pattern:**
```html
<head>
  <style>/* Critical CSS inlined (< 14KB) */</style>
  <link rel="preload" href="/rest.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/rest.css"></noscript>
</head>
```

**Defer JavaScript:**
```html
<script src="/app.js" defer></script>
<script src="/analytics.js" async></script>
```

### 4. Client-side rendering

**Problem:** Content not in initial HTML.

**Solutions:**

**Server-side rendering (SSR):**
```javascript
// Next.js
export async function getServerSideProps() {
  const data = await fetchHeroContent();
  return { props: { hero: data } };
}
```

**Static site generation (SSG):**
```javascript
// Next.js
export async function getStaticProps() {
  const data = await fetchHeroContent();
  return { props: { hero: data }, revalidate: 3600 };
}
```

**Streaming SSR:**
```jsx
// React 18+
import { Suspense } from 'react';

function Page() {
  return (
    <>
      <StaticHero />
      <Suspense fallback={<Spinner />}>
        <DynamicContent />
      </Suspense>
    </>
  );
}
```

## Framework-specific tips

### Next.js
```jsx
import Image from 'next/image';

// LCP image with priority
<Image 
  src="/hero.jpg" 
  alt="Hero" 
  priority 
  width={1200} 
  height={600}
/>
```

### Nuxt
```vue
<NuxtImg 
  src="/hero.jpg" 
  alt="Hero"
  preload
  width="1200"
  height="600"
/>
```

### Astro
```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';
---

<Image src={hero} alt="Hero image" width={1200} height={600} />
```

## Debugging LCP

```javascript
// Identify LCP element
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];

  console.log('LCP:', {
    element: lastEntry.element,
    time: lastEntry.startTime,
    size: lastEntry.size,
    url: lastEntry.url,
    renderTime: lastEntry.renderTime,
    loadTime: lastEntry.loadTime
  });
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

## Common issues

| Issue | Impact | Fix |
|-------|--------|-----|
| No preload for LCP image | +500-1000ms | Add `<link rel="preload">` |
| Large unoptimized image | +300-800ms | Compress, use WebP/AVIF |
| Render-blocking CSS | +200-500ms | Inline critical CSS |
| Slow TTFB | +300-2000ms | CDN, edge caching |
| Client-rendered content | +500-2000ms | SSR/SSG |
