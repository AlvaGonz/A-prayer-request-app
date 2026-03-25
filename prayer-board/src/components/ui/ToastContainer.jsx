import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './ToastContainer.css';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="global-toast-container" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = getIconForType(toast.type);

          return (
            <m.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`toast-notification toast-${toast.type}`}
              role="alert"
            >
              <div className="toast-icon-wrapper">
                <Icon size={20} className="toast-icon" />
              </div>

              <div className="toast-content">
                <p className="toast-message">{toast.message}</p>
              </div>

              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </m.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const getIconForType = (type) => {
  switch (type) {
    case 'success':
      return CheckCircle2;
    case 'error':
    case 'warning':
      return AlertCircle;
    case 'info':
    default:
      return Info;
  }
};

export default ToastContainer;
