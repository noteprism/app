import { themeColors, darkThemeColors } from './colors';

// CSS variables for light mode
export const lightThemeVars = {
  '--surface1': themeColors.surface,
  '--surface2': themeColors.surfaceVariant,
  '--surface3': themeColors.inverseSurface,
  '--surface4': themeColors.background,
  '--surface5': themeColors.primaryContainer,
  '--on-surface': themeColors.onSurface,
  '--on-surface-variant': themeColors.onSurfaceVariant,
  '--shadow-low': `0 2px 4px ${themeColors.shadow}`,
  '--shadow-medium': `0 4px 8px ${themeColors.shadow}`,
  '--shadow-high': `0 8px 16px ${themeColors.shadow}`,
};

// CSS variables for dark mode
export const darkThemeVars = {
  '--dark-surface1': darkThemeColors.surface,
  '--dark-surface2': darkThemeColors.surfaceVariant,
  '--dark-surface3': darkThemeColors.inverseSurface,
  '--dark-surface4': darkThemeColors.background,
  '--dark-surface5': darkThemeColors.primaryContainer,
  '--dark-on-surface': darkThemeColors.onSurface,
  '--dark-on-surface-variant': darkThemeColors.onSurfaceVariant,
  '--dark-shadow-low': `0 2px 4px ${darkThemeColors.shadow}`,
  '--dark-shadow-medium': `0 4px 8px ${darkThemeColors.shadow}`,
  '--dark-shadow-high': `0 8px 16px ${darkThemeColors.shadow}`,
};

// Function to apply theme variables to document root
export function applyThemeVariables() {
  const root = document.documentElement;
  
  // Apply light theme variables
  Object.entries(lightThemeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Apply dark theme variables
  Object.entries(darkThemeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
} 