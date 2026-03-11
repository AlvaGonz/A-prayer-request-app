import React from 'react';
import { Theme } from './theme';
import './theme.css';

/**
 * LanguageDropdown - A dropdown component for language selection
 * 
 * @param {Object} props
 * @param {string} [props.size="md"] - Size variant: "sm", "md", "lg"
 * @param {boolean} [props.showLabel=false] - Whether to show the full language name
 * @param {string[]} [props.languages=["en", "es"]] - Available languages
 * @param {string} [props.className] - Additional CSS classes
 */
export const LanguageDropdown = ({
  size = "md",
  showLabel = false,
  languages = ["en", "es"],
  className = "",
}) => {
  return (
    <Theme
      variant="dropdown"
      size={size}
      showLabel={showLabel}
      languages={languages}
      className={className}
    />
  );
};

/**
 * LanguageButton - A button that cycles through languages on click
 * 
 * @param {Object} props
 * @param {string} [props.size="md"] - Size variant: "sm", "md", "lg"
 * @param {boolean} [props.showLabel=false] - Whether to show the full language name
 * @param {string[]} [props.languages=["en", "es"]] - Available languages
 * @param {string} [props.className] - Additional CSS classes
 */
export const LanguageButton = ({
  size = "md",
  showLabel = false,
  languages = ["en", "es"],
  className = "",
}) => {
  return (
    <Theme
      variant="button"
      size={size}
      showLabel={showLabel}
      languages={languages}
      className={className}
    />
  );
};
