# Findings

- **CSS Transformations Limit Positioning:** Any Element styled with Framer Motion `translate`, `scale`, or manually using CSS `transform` creates a "new block formatting context". When this happens, children with `position: fixed` become anchored to that transformed element, bypassing the browser viewport! The only way to achieve true global positioning for a fixed overlay element is to portal it away into the DOM root (`createPortal`).
- **Server Notifications Structure:** The API method `pray` inside `server/controllers/requestController.js` reliably returns `{ prayedCount, message }`. The `usePrayMutation` parses this exact payload, allowing the client interface to display dynamic backend messages.
