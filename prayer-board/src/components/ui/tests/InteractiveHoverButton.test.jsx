import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveHoverButton } from '../InteractiveHoverButton';

describe('InteractiveHoverButton', () => {
  // Test 1: renders with default text "Button"
  it('renders with default text "Button"', () => {
    render(<InteractiveHoverButton />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Button');
  });

  // Test 2: renders custom text prop
  it('renders custom text prop', () => {
    render(<InteractiveHoverButton text="Click Me" />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click Me');
  });

  // Test 3: calls onClick when clicked and not disabled
  it('calls onClick when clicked and not disabled', () => {
    const handleClick = vi.fn();
    render(<InteractiveHoverButton text="Click Me" onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test 4: does NOT call onClick when disabled
  it('does NOT call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<InteractiveHoverButton text="Click Me" onClick={handleClick} disabled />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  // Test 5: applies additional className correctly
  it('applies additional className correctly', () => {
    render(<InteractiveHoverButton text="Click Me" className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('interactive-hover-btn');
    expect(button).toHaveClass('custom-class');
  });

  // Test 6: forwards ref to button element
  it('forwards ref to button element', () => {
    const ref = React.createRef();
    render(<InteractiveHoverButton text="Click Me" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent('Click Me');
  });
});
