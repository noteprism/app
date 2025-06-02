import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { argbFromHex, hexFromArgb, themeFromSourceColor, type Theme } from '$lib/ui/components/elements/color/material/color';
import { DEFAULT_THEME, type ThemeTokens, hctToHex, MD3_COLOR_TOKENS } from './tokens';

// Theme preference store
export const isDarkMode = writable(false);

// Initialize dark mode from system preference
if (browser) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode.set(prefersDark);
}

// Theme tokens store
export const themeTokens = writable<ThemeTokens>(DEFAULT_THEME);

// Convert current theme tokens to hex color for material theme generation
export const brandColor = derived(themeTokens, ($themeTokens) => {
    return hctToHex($themeTokens.source.hue, $themeTokens.source.chroma, $themeTokens.source.tone);
});

// Derived theme store
export const theme = derived(
    [brandColor, isDarkMode],
    ([$brandColor, $isDarkMode]) => {
        const argb = argbFromHex($brandColor);
        const materialTheme = themeFromSourceColor($brandColor);
        return materialTheme;
    }
);

// Helper to apply theme to document root
export function applyTheme(materialTheme: Theme, isDark: boolean) {
    if (!browser) return;

    const scheme = isDark ? materialTheme.schemes.dark : materialTheme.schemes.light;
    const root = document.documentElement;

    // Apply each color as a CSS variable
    Object.entries(scheme.toJSON()).forEach(([key, value]) => {
        const cssVar = MD3_COLOR_TOKENS[key as keyof typeof MD3_COLOR_TOKENS];
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