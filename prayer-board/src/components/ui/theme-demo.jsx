import React from 'react';
import { LanguageDropdown, LanguageButton } from './theme-dropdown';
import './theme.css';

/**
 * ThemeDemo - Showcase of all language selector variants
 */
export const ThemeDemo = () => {
  return (
    <div className="theme-demo">
      <h3>Language Selector Variants</h3>
      
      <div className="theme-demo-section">
        <h4>Dropdown (Default)</h4>
        <div className="theme-demo-row">
          <LanguageDropdown size="sm" />
          <LanguageDropdown size="md" />
          <LanguageDropdown size="lg" />
        </div>
      </div>

      <div className="theme-demo-section">
        <h4>Dropdown with Labels</h4>
        <div className="theme-demo-row">
          <LanguageDropdown size="sm" showLabel />
          <LanguageDropdown size="md" showLabel />
          <LanguageDropdown size="lg" showLabel />
        </div>
      </div>

      <div className="theme-demo-section">
        <h4>Button (Cycles on Click)</h4>
        <div className="theme-demo-row">
          <LanguageButton size="sm" />
          <LanguageButton size="md" />
          <LanguageButton size="lg" />
        </div>
      </div>

      <div className="theme-demo-section">
        <h4>Button with Labels</h4>
        <div className="theme-demo-row">
          <LanguageButton size="sm" showLabel />
          <LanguageButton size="md" showLabel />
          <LanguageButton size="lg" showLabel />
        </div>
      </div>
    </div>
  );
};
