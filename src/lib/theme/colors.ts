import { argbFromHex, themeFromSourceColor, hexFromArgb } from '@material/material-color-utilities';

export const brandColors = {
  primary: '#2CD2ED',
  secondary: '#7A959C',
  tertiary: '#868FB6',
  error: '#FF5449',
  neutral: '#8E9192',
  neutralVariant: '#899295'
};

// Convert hex colors to ARGB
const primaryArgb = argbFromHex(brandColors.primary);

// Generate theme from primary color
export const theme = themeFromSourceColor(primaryArgb);

// Convert theme colors back to hex
export const themeColors = {
  primary: hexFromArgb(theme.schemes.light.primary),
  onPrimary: hexFromArgb(theme.schemes.light.onPrimary),
  primaryContainer: hexFromArgb(theme.schemes.light.primaryContainer),
  onPrimaryContainer: hexFromArgb(theme.schemes.light.onPrimaryContainer),
  secondary: hexFromArgb(theme.schemes.light.secondary),
  onSecondary: hexFromArgb(theme.schemes.light.onSecondary),
  secondaryContainer: hexFromArgb(theme.schemes.light.secondaryContainer),
  onSecondaryContainer: hexFromArgb(theme.schemes.light.onSecondaryContainer),
  tertiary: hexFromArgb(theme.schemes.light.tertiary),
  onTertiary: hexFromArgb(theme.schemes.light.onTertiary),
  tertiaryContainer: hexFromArgb(theme.schemes.light.tertiaryContainer),
  onTertiaryContainer: hexFromArgb(theme.schemes.light.onTertiaryContainer),
  error: hexFromArgb(theme.schemes.light.error),
  onError: hexFromArgb(theme.schemes.light.onError),
  errorContainer: hexFromArgb(theme.schemes.light.errorContainer),
  onErrorContainer: hexFromArgb(theme.schemes.light.onErrorContainer),
  background: hexFromArgb(theme.schemes.light.background),
  onBackground: hexFromArgb(theme.schemes.light.onBackground),
  surface: hexFromArgb(theme.schemes.light.surface),
  onSurface: hexFromArgb(theme.schemes.light.onSurface),
  surfaceVariant: hexFromArgb(theme.schemes.light.surfaceVariant),
  onSurfaceVariant: hexFromArgb(theme.schemes.light.onSurfaceVariant),
  outline: hexFromArgb(theme.schemes.light.outline),
  outlineVariant: hexFromArgb(theme.schemes.light.outlineVariant),
  shadow: hexFromArgb(theme.schemes.light.shadow),
  scrim: hexFromArgb(theme.schemes.light.scrim),
  inverseSurface: hexFromArgb(theme.schemes.light.inverseSurface),
  inverseOnSurface: hexFromArgb(theme.schemes.light.inverseOnSurface),
  inversePrimary: hexFromArgb(theme.schemes.light.inversePrimary),
};

// Dark theme colors
export const darkThemeColors = {
  primary: hexFromArgb(theme.schemes.dark.primary),
  onPrimary: hexFromArgb(theme.schemes.dark.onPrimary),
  primaryContainer: hexFromArgb(theme.schemes.dark.primaryContainer),
  onPrimaryContainer: hexFromArgb(theme.schemes.dark.onPrimaryContainer),
  secondary: hexFromArgb(theme.schemes.dark.secondary),
  onSecondary: hexFromArgb(theme.schemes.dark.onSecondary),
  secondaryContainer: hexFromArgb(theme.schemes.dark.secondaryContainer),
  onSecondaryContainer: hexFromArgb(theme.schemes.dark.onSecondaryContainer),
  tertiary: hexFromArgb(theme.schemes.dark.tertiary),
  onTertiary: hexFromArgb(theme.schemes.dark.onTertiary),
  tertiaryContainer: hexFromArgb(theme.schemes.dark.tertiaryContainer),
  onTertiaryContainer: hexFromArgb(theme.schemes.dark.onTertiaryContainer),
  error: hexFromArgb(theme.schemes.dark.error),
  onError: hexFromArgb(theme.schemes.dark.onError),
  errorContainer: hexFromArgb(theme.schemes.dark.errorContainer),
  onErrorContainer: hexFromArgb(theme.schemes.dark.onErrorContainer),
  background: hexFromArgb(theme.schemes.dark.background),
  onBackground: hexFromArgb(theme.schemes.dark.onBackground),
  surface: hexFromArgb(theme.schemes.dark.surface),
  onSurface: hexFromArgb(theme.schemes.dark.onSurface),
  surfaceVariant: hexFromArgb(theme.schemes.dark.surfaceVariant),
  onSurfaceVariant: hexFromArgb(theme.schemes.dark.onSurfaceVariant),
  outline: hexFromArgb(theme.schemes.dark.outline),
  outlineVariant: hexFromArgb(theme.schemes.dark.outlineVariant),
  shadow: hexFromArgb(theme.schemes.dark.shadow),
  scrim: hexFromArgb(theme.schemes.dark.scrim),
  inverseSurface: hexFromArgb(theme.schemes.dark.inverseSurface),
  inverseOnSurface: hexFromArgb(theme.schemes.dark.inverseOnSurface),
  inversePrimary: hexFromArgb(theme.schemes.dark.inversePrimary),
}; 