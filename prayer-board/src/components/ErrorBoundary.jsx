import React from 'react';
import * as Sentry from '@sentry/react';
import i18next from 'i18next';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)'
        }}>
          <h1 style={{ marginBottom: '16px' }}>{i18next.t('errorBoundary.title')}</h1>
          <p style={{ marginBottom: '24px', color: 'var(--color-text-secondary)' }}>
            {i18next.t('errorBoundary.message')}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--color-accent-gold)',
              color: 'var(--color-bg-primary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {i18next.t('errorBoundary.refresh')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
