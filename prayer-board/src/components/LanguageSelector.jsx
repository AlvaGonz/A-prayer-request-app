import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-selector">
      <Globe size={18} aria-hidden="true" />
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        aria-label={t('language.select')}
        className="language-select"
      >
        <option value="en">{t('language.en')}</option>
        <option value="es">{t('language.es')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
