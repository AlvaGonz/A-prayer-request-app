import './instrument'; // Sentry must init before all other imports
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

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
