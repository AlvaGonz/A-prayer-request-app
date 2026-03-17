import './instrument'; // Sentry must init before all other imports
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

// Silence SW registration errors from bots/crawlers (Sentry ADV-SW-001)
// VitePWA uses autoRegister which can fail in restricted contexts
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message === 'Rejected' ||
    event.reason?.stack?.includes('serviceWorker')
  ) {
    event.preventDefault(); // Prevents Sentry from capturing it
    console.warn('[SW] Registration failed (non-critical):', event.reason?.message);
  }
});

// Silencing the i18next Locize sponsor message in console as requested
const originalConsoleLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Locize')) return;
  originalConsoleLog(...args);
};
import './i18n'; // Initialize i18n

import App from './App.jsx';
import { QueryProvider } from './providers/QueryProvider';
import { Analytics } from '@vercel/analytics/react';
import { LazyMotion, domAnimation } from 'framer-motion';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LazyMotion features={domAnimation}>
      <QueryProvider>
        <App />
        <Analytics />
      </QueryProvider>
    </LazyMotion>
  </StrictMode>,
)
