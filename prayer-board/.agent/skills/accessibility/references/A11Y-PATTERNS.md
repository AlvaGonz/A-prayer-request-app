---

## Form labels

Every form input needs a programmatically associated label. This is the #1 accessibility issue on the web.

**Explicit association (recommended):**
```html
<label for="email">Email address</label>
<input type="email" id="email" name="email" autocomplete="email">
```

**Implicit association:**
```html
<label>
  Email address
  <input type="email" name="email" autocomplete="email">
</label>
```

**With additional instructions:**
```html
<label for="password">Password</label>
<input 
  type="password" 
  id="password" 
  name="password"
  aria-describedby="password-help"
>
<p id="password-help">Must be at least 8 characters with one number.</p>
```

---

## Error handling

Forms need accessible error announcements and focus management.

```html
<form onsubmit="return validateForm()">
  <div role="alert" id="error-summary" aria-live="polite" style="display: none;">
    <h3>There are 2 errors to fix</h3>
    <ul>
      <li><a href="#email">Email: Enter a valid email address</a></li>
    </ul>
  </div>

  <div>
    <label for="email">Email</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      aria-invalid="true"
      aria-describedby="email-error"
    >
    <span id="email-error" class="error">Enter a valid email address</span>
  </div>

  <button type="submit">Submit</button>
</form>
```

```javascript
function validateForm() {
  const errors = [];
  const email = document.getElementById('email');
  
  if (!email.validity.valid) {
    errors.push({ field: 'email', message: 'Enter a valid email address' });
    email.setAttribute('aria-invalid', 'true');
  }
  
  if (errors.length > 0) {
    const summary = document.getElementById('error-summary');
    summary.style.display = 'block';
    summary.querySelector('a').focus(); // Focus first error
    return false;
  }
  
  return true;
}
```

---

## Skip link

Skip links let keyboard users bypass repetitive navigation.

```html
<!-- Place as the first focusable element -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<nav><!-- Navigation --></nav>

<main id="main-content" tabindex="-1">
  <!-- Page content -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Ensure main can receive focus */
#main-content:focus {
  outline: none;
}
```

---

## Modal focus trap

When a modal opens, focus must be trapped inside until closed.

```html
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="modal-title"
  class="modal-overlay"
  onclick="closeModalOnOverlay(event)"
>
  <div class="modal-content" role="document">
    <h2 id="modal-title">Confirm Action</h2>
    <p>Are you sure you want to proceed?</p>
    <button onclick="confirm()">Yes</button>
    <button onclick="closeModal()">Cancel</button>
  </div>
</div>
```

```javascript
class ModalFocusTrap {
  constructor(modalElement) {
    this.modal = modalElement;
    this.focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    this.previousActiveElement = null;
  }
  
  open() {
    this.previousActiveElement = document.activeElement;
    this.modal.hidden = false;
    
    // Focus first focusable element or the modal itself
    const focusable = this.modal.querySelectorAll(this.focusableSelectors);
    (focusable[0] || this.modal).focus();
    
    // Add event listeners
    this.modal.addEventListener('keydown', this.handleKeyDown);
  }
  
  close() {
    this.modal.hidden = true;
    this.modal.removeEventListener('keydown', this.handleKeyDown);
    
    // Return focus to trigger element
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
  
  handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    
    const focusable = this.modal.querySelectorAll(this.focusableSelectors);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

// Usage
const modal = new ModalFocusTrap(document.getElementById('my-modal'));
document.getElementById('open-btn').addEventListener('click', () => modal.open());
```

---

## Dragging movements

Any action triggered by dragging must offer a single-pointer alternative (WCAG 2.5.7).

```html
<!-- Sortable list with drag and button alternatives -->
<ul class="sortable-list" role="list">
  <li>
    <span>Item 1</span>
    <button class="drag-handle" aria-label="Drag to reorder Item 1">
      <svg aria-hidden="true">...</svg>
    </button>
    <button aria-label="Move Item 1 up" onclick="moveUp(this)">↑</button>
    <button aria-label="Move Item 1 down" onclick="moveDown(this)">↓</button>
  </li>
</ul>
```

Also applies to sliders, map panning, colour pickers, and similar drag-based widgets—always provide an equivalent click/tap or keyboard path.

---

## ARIA tabs

Tabs require `role="tablist"`, `role="tab"`, and `role="tabpanel"` with proper `aria-selected`, `aria-controls`, and keyboard support.

```html
<div class="tabs">
  <div role="tablist" aria-label="Product information">
    <button 
      role="tab" 
      id="tab-desc"
      aria-selected="true" 
      aria-controls="panel-desc"
      tabindex="0"
    >
      Description
    </button>
    <button 
      role="tab" 
      id="tab-specs"
      aria-selected="false" 
      aria-controls="panel-specs"
      tabindex="-1"
    >
      Specifications
    </button>
  </div>
  
  <div 
    role="tabpanel" 
    id="panel-desc"
    aria-labelledby="tab-desc"
  >
    <!-- Description content -->
  </div>
  
  <div 
    role="tabpanel" 
    id="panel-specs"
    aria-labelledby="tab-specs"
    hidden
  >
    <!-- Specifications content -->
  </div>
</div>
```

Arrow keys should move focus between tabs; the active tab receives `tabindex="0"` while inactive tabs use `tabindex="-1"`.

---

## Live regions and notifications

Use `aria-live` to announce dynamic content changes to screen readers without moving focus.

```html
<div aria-live="polite" aria-atomic="true" id="status-announcer"></div>
<div aria-live="assertive" aria-atomic="true" id="alert-announcer"></div>
```

```javascript
function showNotification(message, type = 'polite') {
  const container = document.getElementById(`${type}-announcer`);
  container.textContent = '';
  requestAnimationFrame(() => {
    container.textContent = message;
  });
}
```

Clear the container before writing to ensure the same message triggers a new announcement.

---

## Screen reader commands

Quick reference for the most common screen reader shortcuts.

| Action | VoiceOver (Mac) | NVDA (Windows) |
|--------|-----------------|----------------|
| Start/Stop | ⌘ + F5 | Ctrl + Alt + N |
| Next item | VO + → | ↓ |
| Previous item | VO + ← | ↑ |
| Activate | VO + Space | Enter |
| Headings list | VO + U, then arrows | H / Shift + H |
| Links list | VO + U | K / Shift + K |
