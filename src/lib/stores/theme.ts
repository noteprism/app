import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { argbFromHex, hexFromArgb, themeFromSourceColor, type Theme } from '$lib/ui/components/elements/color/material/color';
import { DEFAULT_THEME, type ThemeTokens, hctToHex, MD3_COLOR_TOKENS } from '$lib/ui/theme/tokens';

// Theme loading state
export const isThemeLoading = writable(true);

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
    // Create a derived store that combines theme and dark mode
    const themeWithMode = derived(
        [theme, isDarkMode],
        ([$theme, $isDark]) => {
            applyTheme($theme, $isDark);
            // Theme is now loaded
            isThemeLoading.set(false);
        }
    );

    // Subscribe to the combined store
    themeWithMode.subscribe(() => {});
}

// Save theme preferences to server
export async function saveTheme(userId: string) {
    if (!browser) return;

    let currentTheme: ThemeTokens = DEFAULT_THEME;
    let currentDarkMode = false;

    // Get current values from stores
    themeTokens.subscribe(value => currentTheme = value)();
    isDarkMode.subscribe(value => currentDarkMode = value)();

    try {
        const response = await fetch(`/api/theme/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hue: currentTheme.source.hue,
                chroma: currentTheme.source.chroma,
                tone: currentTheme.source.tone,
                darkMode: currentDarkMode
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save theme');
        }
    } catch (error) {
        console.error('Failed to save theme:', error);
    }
}

// Load theme preferences from server
export async function loadTheme(userId: string) {
    if (!browser) return;

    isThemeLoading.set(true);
    try {
        const response = await fetch(`/api/theme/${userId}`);
        if (response.ok) {
            const userTheme = await response.json();
            if (userTheme) {
                themeTokens.set({
                    source: {
                        hue: userTheme.hue,
                        chroma: userTheme.chroma,
                        tone: userTheme.tone
                    }
                });
                isDarkMode.set(userTheme.darkMode);
            }
        }
    } catch (error) {
        console.error('Failed to load theme:', error);
    } finally {
        isThemeLoading.set(false);
    }
} 