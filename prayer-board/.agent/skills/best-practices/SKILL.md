---
name: best-practices
description: Apply modern web development best practices for security, compatibility, and code quality. Use when asked to "apply best practices", "security audit", "modernize code", "code quality review", or "check for vulnerabilities".
license: MIT
metadata:
 author: web-quality-skills
 version: "1.0"
---

# Best practices

Modern web development standards based on Lighthouse best practices audits. Covers security, browser compatibility, and code quality patterns.

## Security

### HTTPS everywhere

**Enforce HTTPS:**
```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

**HSTS Header:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Content Security Policy (CSP)

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'nonce-abc123' https://trusted.com;
  style-src 'self' 'nonce-abc123';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
">
```

**CSP Header (recommended):**
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123' https://trusted.com;
  style-src 'self' 'nonce-abc123';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
```

**Using nonces for inline scripts:**
```html
<script nonce="abc123">
  // This inline script is allowed
  console.log('Hello');
</script>
```

### Security headers

```
# Prevent clickjacking
X-Frame-Options: DENY

# Prevent MIME type sniffing
X-Content-Type-Options: nosniff

# Enable XSS filter (legacy browsers)
X-XSS-Protection: 1; mode=block

# Control referrer information
Referrer-Policy: strict-origin-when-cross-origin

# Permissions policy (formerly Feature-Policy)
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### No vulnerable libraries

```bash
# Check for vulnerabilities
npm audit
yarn audit

# Auto-fix when possible
npm audit fix

# Check specific package
npm ls lodash
```

**Keep dependencies updated:**
```json
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "update": "npm update && npm audit fix"
  }
}
```

**Known vulnerable patterns to avoid:**
```javascript
// ❌ Prototype pollution vulnerable patterns
Object.assign(target, userInput);
_.merge(target, userInput);

// ✅ Safer alternatives
const safeData = JSON.parse(JSON.stringify(userInput));
```

### Input sanitization

```javascript
// ❌ XSS vulnerable
element.innerHTML = userInput;
document.write(userInput);

// ✅ Safe text content
element.textContent = userInput;

// ✅ If HTML needed, sanitize
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Secure cookies

```javascript
// ❌ Insecure cookie
document.cookie = "session=abc123";

// ✅ Secure cookie (server-side)
Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Strict; Path=/
```

---

## Browser compatibility

### Doctype declaration

```html
<!DOCTYPE html>
<!-- Always use HTML5 doctype -->
```

### Character encoding

```html
<meta charset="utf-8">
<!-- Must be in first 1024 bytes -->
```

### Viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Feature detection

```javascript
// ❌ Browser detection (brittle)
if (navigator.userAgent.includes('Chrome')) {
  // Chrome-specific code
}

// ✅ Feature detection
if ('IntersectionObserver' in window) {
  // Use IntersectionObserver
} else {
  // Fallback
}

// ✅ Using @supports in CSS
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}
```

### Polyfills (when needed)

```html
<!-- Only load if needed -->
<script>
  if (!('fetch' in window)) {
    document.write('<script src="/polyfills/fetch.js"><\/script>');
  }
</script>
```

---

## Deprecated APIs

### Avoid these

```javascript
// ❌ document.write (blocks parsing)
document.write('<script src="...">');

// ✅ Dynamic script loading
const script = document.createElement('script');
script.src = '...';
document.head.appendChild(script);

// ❌ Synchronous XHR (blocks main thread)
const xhr = new XMLHttpRequest();
xhr.open('GET', url, false); // false = synchronous

// ✅ Async fetch
const response = await fetch(url);

// ❌ Application Cache (deprecated)
<html manifest="cache.manifest">

// ✅ Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### Event listener passive

```javascript
// ❌ Non-passive touch/wheel (may block scrolling)
element.addEventListener('touchstart', handler);
element.addEventListener('wheel', handler);

// ✅ Passive listeners (allows smooth scrolling)
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('wheel', handler, { passive: true });

// ✅ If you need preventDefault, be explicit
element.addEventListener('touchstart', handler, { passive: false });
```

---

## Console & errors

### No console errors

```javascript
// ❌ Errors in production
console.log('Debug info'); // Remove in production
throw new Error('Unhandled'); // Catch all errors

// ✅ Proper error handling
try {
  riskyOperation();
} catch (error) {
  // Log to error tracking service
  errorTracker.captureException(error);
  // Show user-friendly message
  showErrorMessage('Something went wrong. Please try again.');
}
```

### Error boundaries (React)

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    errorTracker.captureException(error, { extra: info });
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### Global error handler

```javascript
// Catch unhandled errors
window.addEventListener('error', (event) => {
  errorTracker.captureException(event.error);
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  errorTracker.captureException(event.reason);
});
```

---

## Source maps

### Production configuration

```javascript
// ❌ Source maps exposed in production
// webpack.config.js
module.exports = {
  devtool: 'source-map', // Exposes source code
};

// ✅ Hidden source maps (uploaded to error tracker)
module.exports = {
  devtool: 'hidden-source-map',
};

// ✅ Or no source maps in production
module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
};
```

---

## Performance best practices

### Avoid blocking patterns

```javascript
// ❌ Blocking script
<script src="/heavy.js"></script>

// ✅ Deferred script
<script src="/heavy.js" defer></script>

// ❌ Blocking CSS import
@import url('other-styles.css');

// ✅ Link tags (parallel loading)
<link rel="stylesheet" href="other-styles.css">
```

### Efficient event handlers

```javascript
// ❌ Handler on every element
items.forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ Event delegation
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e);
  }
});
```

### Memory management

```javascript
// ❌ Memory leak (never removed)
const handler = () => { /* ... */ };
window.addEventListener('resize', handler);

// ✅ Cleanup when done
const handler = () => { /* ... */ };
window.addEventListener('resize', handler);

// Later, when component unmounts:
window.removeEventListener('resize', handler);

// ✅ Using AbortController
const controller = new AbortController();
window.addEventListener('resize', handler, { signal: controller.signal });

// Cleanup:
controller.abort();
```

---

## Code quality

### Valid HTML

```html
<!-- ❌ Invalid: Duplicate ID -->
<div id="header">...</div>
<div id="header">...</div>

<!-- ❌ Invalid: Wrong nesting -->
<p>Text <div>Block</div></p>

<!-- ✅ Valid HTML -->
<header id="main-header">...</header>
<p>Text <span>inline</span></p>
```

### Modern JavaScript

```javascript
// ✅ Use const/let, not var
const PI = 3.14159;
let count = 0;

// ✅ Use template literals
const message = `Hello, ${name}!`;

// ✅ Use destructuring
const { id, name } = user;
const [first, second] = items;

// ✅ Use arrow functions for callbacks
const doubled = numbers.map(n => n * 2);

// ✅ Use async/await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
```

---

## Testing checklist

### Automated
- [ ] No console errors in production
- [ ] No deprecated API usage
- [ ] CSP headers configured
- [ ] Security headers present
- [ ] npm audit passes

### Manual
- [ ] Works in target browsers
- [ ] Graceful degradation for older browsers
- [ ] No mixed content (HTTP on HTTPS page)
- [ ] Proper error handling
- [ ] Memory leaks checked

## References

- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [web.dev Security](https://web.dev/secure/)
- [Can I Use](https://caniuse.com/)
