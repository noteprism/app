import { theme, themeColors, darkThemeColors, brandColors } from './colors';

// Surface utilities
export const surfaces = {
  surface1: themeColors.surface,
  surface2: themeColors.surfaceVariant,
  surface3: themeColors.inverseSurface,
  surface4: themeColors.background,
  surface5: themeColors.primaryContainer,
};

// Text utilities
export const text = {
  primary: themeColors.onSurface,
  secondary: themeColors.onSurfaceVariant,
  onPrimary: themeColors.onPrimary,
  onSecondary: themeColors.onSecondary,
  onTertiary: themeColors.onTertiary,
  onError: themeColors.onError,
};

// State utilities
export const states = {
  hover: themeColors.surfaceVariant,
  focus: themeColors.primaryContainer,
  pressed: themeColors.primary,
  disabled: themeColors.outline,
};

// Role-based colors
export const roles = {
  primaryAction: themeColors.primary,
  secondaryAction: themeColors.secondary,
  background: themeColors.background,
  surface: themeColors.surface,
  error: themeColors.error,
  success: themeColors.tertiary,
  warning: themeColors.errorContainer,
};

export {
  theme,
  themeColors,
  darkThemeColors,
  brandColors,
}; 