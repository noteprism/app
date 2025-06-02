import { Hct } from '@material/material-color-utilities';

// Default theme color in HCT
// Sky blue: approximate HCT values for #2cd2ed
export const DEFAULT_THEME = {
    source: {
        hue: 190,
        chroma: 70,
        tone: 65
    }
};

export type ThemeTokens = {
    source: {
        hue: number;
        chroma: number;
        tone: number;
    };
};

/**
 * Converts HCT color values to a hex string
 */
export function hctToHex(hue: number, chroma: number, tone: number): string {
    const color = Hct.from(hue, chroma, tone);
    const argb = color.toInt();
    return '#' + ((argb & 0xffffff) | 0x1000000).toString(16).slice(1);
}

/**
 * Converts a hex color to HCT values
 */
export function hexToHct(hex: string): { hue: number; chroma: number; tone: number } {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Convert RGB to ARGB (assuming full opacity)
    const argb = (0xff << 24) | (r << 16) | (g << 8) | b;
    
    // Create HCT color
    const hct = Hct.fromInt(argb);
    
    return {
        hue: hct.hue,
        chroma: hct.chroma,
        tone: hct.tone
    };
}

// CSS Custom Property names for Material Design 3 color tokens
export const MD3_COLOR_TOKENS = {
    primary: '--md-sys-color-primary',
    onPrimary: '--md-sys-color-on-primary',
    primaryContainer: '--md-sys-color-primary-container',
    onPrimaryContainer: '--md-sys-color-on-primary-container',
    secondary: '--md-sys-color-secondary',
    onSecondary: '--md-sys-color-on-secondary',
    secondaryContainer: '--md-sys-color-secondary-container',
    onSecondaryContainer: '--md-sys-color-on-secondary-container',
    tertiary: '--md-sys-color-tertiary',
    onTertiary: '--md-sys-color-on-tertiary',
    tertiaryContainer: '--md-sys-color-tertiary-container',
    onTertiaryContainer: '--md-sys-color-on-tertiary-container',
    error: '--md-sys-color-error',
    onError: '--md-sys-color-on-error',
    errorContainer: '--md-sys-color-error-container',
    onErrorContainer: '--md-sys-color-on-error-container',
    background: '--md-sys-color-background',
    onBackground: '--md-sys-color-on-background',
    surface: '--md-sys-color-surface',
    onSurface: '--md-sys-color-on-surface',
    surfaceVariant: '--md-sys-color-surface-variant',
    onSurfaceVariant: '--md-sys-color-on-surface-variant',
    surfaceDim: '--md-sys-color-surface-dim',
    surfaceBright: '--md-sys-color-surface-bright',
    surfaceContainerLowest: '--md-sys-color-surface-container-lowest',
    surfaceContainerLow: '--md-sys-color-surface-container-low',
    surfaceContainer: '--md-sys-color-surface-container',
    surfaceContainerHigh: '--md-sys-color-surface-container-high',
    surfaceContainerHighest: '--md-sys-color-surface-container-highest',
    outline: '--md-sys-color-outline',
    outlineVariant: '--md-sys-color-outline-variant',
    shadow: '--md-sys-color-shadow',
    scrim: '--md-sys-color-scrim',
    inverseSurface: '--md-sys-color-inverse-surface',
    inverseOnSurface: '--md-sys-color-inverse-on-surface',
    inversePrimary: '--md-sys-color-inverse-primary',
} as const; 