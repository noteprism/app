import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { argbFromHex, hexFromArgb, themeFromSourceColor, type Theme } from '$lib/ui/components/elements/color/material/color';

// Default brand color (Sky)
const DEFAULT_BRAND_COLOR = '#2cd2ed';

// Theme preference store
export const isDarkMode = writable(false);

// Initialize dark mode from system preference
if (browser) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.set(prefersDark);
}

// Brand color store
export const brandColor = writable(DEFAULT_BRAND_COLOR);

// Derived theme store
export const theme = derived(
    [brandColor, isDarkMode],
    ([$brandColor, $isDarkMode]) => {
        const argb = argbFromHex($brandColor);
        const materialTheme = themeFromSourceColor($brandColor);
        return materialTheme;
    }
);

// CSS variable names mapping
const cssVarNames = {
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

// Helper to apply theme to document root
export function applyTheme(materialTheme: Theme, isDark: boolean) {
    if (!browser) return;

    const scheme = isDark ? materialTheme.schemes.dark : materialTheme.schemes.light;
    const root = document.documentElement;

    // Apply each color as a CSS variable
    Object.entries(scheme.toJSON()).forEach(([key, value]) => {
        const cssVar = cssVarNames[key as keyof typeof cssVarNames];
        if (cssVar) {
            root.style.setProperty(cssVar, hexFromArgb(value));
        }
    });
}

// Subscribe to theme changes and apply them
if (browser) {
    theme.subscribe((materialTheme) => {
        isDarkMode.subscribe((dark) => {
            applyTheme(materialTheme, dark);
        });
    });
} 