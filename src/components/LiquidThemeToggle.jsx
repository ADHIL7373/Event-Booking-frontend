/**
 * LiquidThemeToggle - Premium Apple-Inspired Dark/Light Mode Toggle
 * Clean iOS-style toggle switch with smooth animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/useTheme';
import './ThemeToggle.css';

const LiquidThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-toggle"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={false}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      {/* Background track */}
      <motion.div
        className={`toggle-track ${isDark ? 'active' : ''}`}
        animate={{ backgroundColor: isDark ? '#3b82f6' : '#e5e7eb' }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated knob */}
      <motion.div
        className="toggle-knob"
        animate={{ x: isDark ? 18 : 0 }}
        transition={{ duration: 0.22 }}
      />
    </motion.button>
  );
};

export default LiquidThemeToggle;
