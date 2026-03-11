"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";
import "./RippleButton.css";

/**
 * RippleButton - A button component with a material-style ripple effect
 * 
 * @param {Object} props
 * @param {string} [props.rippleColor] - Color of the ripple effect (default: gold tint)
 * @param {string} [props.duration] - Duration of ripple animation (default: 600ms)
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {React.Ref} ref - Forwarded ref
 */
const RippleButton = React.forwardRef(
  (
    {
      className,
      children,
      rippleColor = "rgba(221, 179, 104, 0.3)", // --color-accent-gold with opacity
      duration = "600ms",
      onClick,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState([]);

    const createRipple = useCallback(
      (event) => {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple = {
          x,
          y,
          size,
          key: Date.now(),
        };

        setRipples((prev) => [...prev, newRipple]);
      },
      []
    );

    const handleClick = (event) => {
      if (!disabled) {
        createRipple(event);
        onClick?.(event);
      }
    };

    // Cleanup ripples after animation completes
    useEffect(() => {
      if (ripples.length > 0) {
        const lastRipple = ripples[ripples.length - 1];
        const timeout = setTimeout(() => {
          setRipples((prev) =>
            prev.filter((ripple) => ripple.key !== lastRipple.key)
          );
        }, parseInt(duration));
        return () => clearTimeout(timeout);
      }
    }, [ripples, duration]);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn("ripple-button", disabled && "ripple-button-disabled", className)}
        onClick={handleClick}
        {...props}
      >
        <span className="ripple-button-content">{children}</span>
        <span className="ripple-button-ripples" aria-hidden="true">
          {ripples.map((ripple) => (
            <span
              key={ripple.key}
              className="ripple-button-ripple"
              style={{
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
                top: `${ripple.y}px`,
                left: `${ripple.x}px`,
                backgroundColor: rippleColor,
                animationDuration: duration,
              }}
            />
          ))}
        </span>
      </button>
    );
  }
);

RippleButton.displayName = "RippleButton";

export { RippleButton };
