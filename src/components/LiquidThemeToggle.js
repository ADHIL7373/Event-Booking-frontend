/**
 * LiquidThemeToggle - Slider theme toggle switch
 * Provides smooth transitions between light and dark modes
 */

import React from 'react';
import { useTheme } from '../context/useTheme';
import './LiquidThemeToggle.css';

const LiquidThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <label className="toggle-switch" aria-label="Toggle theme">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="toggle-input"
      />
      <span className="slider"></span>
    </label>
  );
};

export default LiquidThemeToggle;
