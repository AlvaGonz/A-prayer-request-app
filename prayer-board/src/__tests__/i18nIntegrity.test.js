import { describe, it, expect } from 'vitest';
import enTranslations from '../i18n/locales/en.json';
import esTranslations from '../i18n/locales/es.json';

// Helper to get all deeply nested keys
const getKeys = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const currentPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return [...acc, ...getKeys(obj[key], currentPrefix)];
    }
    return [...acc, currentPrefix];
  }, []);
};

// Helper to get all string values
const getValues = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return [...acc, ...getValues(obj[key])];
    }
    return [...acc, obj[key]];
  }, []);
};

describe('i18n Integrity (Adversarial Audit)', () => {
  it('does NOT contain forbidden words (rezo, rezar, rezando, rezos) in Spanish translations', () => {
    const esValues = getValues(esTranslations);
    const forbiddenPattern = /\b(rezo|rezar|rezando|rezos)\b/i;

    // We verify none of the strings contain the forbidden root words
    for (const value of esValues) {
       expect(value).not.toMatch(forbiddenPattern);
    }
  });

  it('has identical keys in English and Spanish translations', () => {
    const enKeys = getKeys(enTranslations).sort();
    const esKeys = getKeys(esTranslations).sort();

    // Ensures we don't have untranslated text where EN keys don't exist in ES
    expect(enKeys).toEqual(esKeys);
  });

  it('has identical key count in both languages', () => {
    const enKeys = getKeys(enTranslations);
    const esKeys = getKeys(esTranslations);

    expect(enKeys.length).toBe(esKeys.length);
  });
  
  it('has no empty values in English or Spanish translations', () => {
    const enValues = getValues(enTranslations);
    const esValues = getValues(esTranslations);

    for (const val of enValues) {
      expect(val.trim()).not.toBe('');
    }
    for (const val of esValues) {
      expect(val.trim()).not.toBe('');
    }
  });
});
