/**
 * useTheme - Custom hook for theme management
 * Access theme state and toggle function throughout the app
 */

import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};

export default useTheme;
