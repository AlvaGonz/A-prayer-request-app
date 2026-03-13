/**
 * Utility function for merging class names
 * Similar to clsx + tailwind-merge but simplified for vanilla CSS
 * @param  {...(string|undefined|null|false)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Conditionally joins class names with a base class
 * @param {string} baseClass - The base class name
 * @param {Object} conditions - Object with class names as keys and booleans as values
 * @returns {string}
 */
export function classNames(baseClass, conditions = {}) {
  const conditionalClasses = Object.entries(conditions)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key);
  
  return cn(baseClass, ...conditionalClasses);
}
