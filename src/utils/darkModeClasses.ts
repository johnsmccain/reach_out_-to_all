/**
 * Dark Mode Utility Classes
 * Provides consistent dark mode styling patterns across the app
 */

export const darkModeClasses = {
  // Background colors
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
    card: 'bg-white dark:bg-gray-800',
    input: 'bg-white dark:bg-gray-700',
  },

  // Text colors
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-700 dark:text-gray-300',
    tertiary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    inverse: 'text-white dark:text-gray-900',
  },

  // Border colors
  border: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
    light: 'border-gray-100 dark:border-gray-800',
  },

  // Hover states
  hover: {
    bg: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    text: 'hover:text-gray-900 dark:hover:text-white',
  },

  // Gradients
  gradient: {
    bg: 'bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30',
    text: 'text-blue-600 dark:text-red-400',
  },

  // Shadows
  shadow: {
    sm: 'shadow-sm dark:shadow-lg',
    md: 'shadow-md dark:shadow-xl',
    lg: 'shadow-lg dark:shadow-2xl',
  },

  // Cards
  card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md',

  // Inputs
  input: 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',

  // Buttons
  button: {
    primary: 'bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
  },
};

/**
 * Combine multiple dark mode classes
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
