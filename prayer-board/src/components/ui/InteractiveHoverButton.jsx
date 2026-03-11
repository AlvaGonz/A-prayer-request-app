import React from 'react';
import { ArrowRight } from 'lucide-react';
import './InteractiveHoverButton.css';

const InteractiveHoverButton = React.forwardRef(
  ({ text = 'Button', className = '', onClick, disabled, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`interactive-hover-btn ${className}`}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        <span className="interactive-hover-btn__text">{text}</span>
        <div className="interactive-hover-btn__reveal">
          <span>{text}</span>
          <ArrowRight size={16} />
        </div>
        <div className="interactive-hover-btn__blob" />
      </button>
    );
  }
);

InteractiveHoverButton.displayName = 'InteractiveHoverButton';
export { InteractiveHoverButton };
