import { argbFromHex as _argbFromHex, hexFromArgb as _hexFromArgb, themeFromSourceColor as _themeFromSourceColor } from '@material/material-color-utilities';
import type { Theme as _Theme, CustomColor } from '@material/material-color-utilities';

// Re-export the types and functions from material-color-utilities
export type Theme = _Theme;
export type { CustomColor };

export function argbFromHex(hex: string): number {
    return _argbFromHex(hex);
}

export function hexFromArgb(argb: number): string {
    return _hexFromArgb(argb);
}

export function themeFromSourceColor(sourceColorHex: string, customColors: CustomColor[] = []): Theme {
    const sourceColor = argbFromHex(sourceColorHex);
    return _themeFromSourceColor(sourceColor, customColors);
} 