import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from './ui/theme-dropdown';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { t } = useTranslation();

  return (
    <div className="language-selector-container" title={t('language.select')}>
      <LanguageDropdown 
        size="md" 
        showLabel={false}
        languages={['en', 'es']}
      />
    </div>
  );
};

export default LanguageSelector;
