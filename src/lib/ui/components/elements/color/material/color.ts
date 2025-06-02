import { argbFromHex, hexFromArgb, themeFromSourceColor as mdThemeFromSourceColor, type Theme } from '@material/material-color-utilities';

export { argbFromHex, hexFromArgb, type Theme };

export function themeFromSourceColor(color: string): Theme {
    return mdThemeFromSourceColor(argbFromHex(color));
}

export function getStateLayer(baseColor: string, state: 'hover' | 'focus' | 'pressed' | 'dragged'): string {
    const opacities = {
        hover: 0.08,
        focus: 0.12,
        pressed: 0.12,
        dragged: 0.16
    };
    return `${baseColor}${Math.round(opacities[state] * 255).toString(16).padStart(2, '0')}`;
} 