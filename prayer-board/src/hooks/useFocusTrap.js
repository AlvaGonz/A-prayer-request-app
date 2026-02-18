import { useEffect, useRef } from 'react';

export const useFocusTrap = (isActive) => {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the first focusable element in the container
      const container = containerRef.current;
      if (container) {
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }

      // Handle tab key to trap focus
      const handleKeyDown = (e) => {
        if (e.key !== 'Tab') return;

        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          // Let the component handle closing
          return;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keydown', handleEscape);
        // Restore previous focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isActive]);

  return containerRef;
};

export default useFocusTrap;
