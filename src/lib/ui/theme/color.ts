import {
    argbFromHex,
    hexFromArgb,
    themeFromSourceColor,
    Hct,
    TonalPalette,
    CorePalette,
    type Theme,
    type SchemeContent
} from '@material/material-color-utilities';

// Tonal values for surface variants in light theme
const SURFACE_TONES = {
    surface: 98,
    surfaceDim: 87,
    surfaceBright: 98,
    surfaceContainerLowest: 100,
    surfaceContainerLow: 96,
    surfaceContainer: 94,
    surfaceContainerHigh: 92,
    surfaceContainerHighest: 90
} as const;

// State layer opacities
const STATE_LAYER_OPACITY = {
    hover: 0.08,
    focus: 0.12,
    pressed: 0.12,
    dragged: 0.16,
    disabled: 0.12
} as const;

// Color blend modes for overlays
export type BlendMode = 'multiply' | 'screen' | 'overlay';

/**
 * Creates a complete theme from a source color
 * @param sourceColor Hex color string
 * @returns Material theme object
 */
export function createTheme(sourceColor: string): Theme {
    const source = argbFromHex(sourceColor);
    return themeFromSourceColor(source);
}

/**
 * Gets a tonal palette from a color
 * @param color Hex color string
 * @returns TonalPalette object
 */
export function getTonalPalette(color: string): TonalPalette {
    const hct = Hct.fromInt(argbFromHex(color));
    return TonalPalette.fromHueAndChroma(hct.hue, hct.chroma);
}

/**
 * Creates a state layer color
 * @param baseColor Base color in hex
 * @param state State type
 * @returns Hex color with opacity
 */
export function getStateLayer(baseColor: string, state: keyof typeof STATE_LAYER_OPACITY): string {
    const base = argbFromHex(baseColor);
    const opacity = STATE_LAYER_OPACITY[state];
    const alpha = Math.round(opacity * 255);
    return hexFromArgb((base & 0x00FFFFFF) | (alpha << 24));
}

/**
 * Gets surface container color for elevation
 * @param theme Material theme
 * @param elevation Surface container level
 * @param isDark Whether in dark mode
 * @returns Hex color for surface
 */
export function getSurfaceColor(
    theme: Theme,
    elevation: keyof typeof SURFACE_TONES,
    isDark: boolean
): string {
    const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
    const tone = isDark ? 100 - SURFACE_TONES[elevation] : SURFACE_TONES[elevation];
    const palette = CorePalette.of(theme.source);
    const neutralPalette = TonalPalette.fromHueAndChroma(palette.a1.hue, palette.a1.chroma);
    return hexFromArgb(neutralPalette.tone(tone));
}

/**
 * Blends two colors using specified blend mode
 * @param base Base color in hex
 * @param blend Blend color in hex
 * @param mode Blend mode
 * @param opacity Opacity of blend color
 * @returns Resulting hex color
 */
export function blendColors(
    base: string,
    blend: string,
    mode: BlendMode = 'multiply',
    opacity: number = 1
): string {
    const baseArgb = argbFromHex(base);
    const blendArgb = argbFromHex(blend);
    
    // Extract RGB components
    const baseR = (baseArgb >> 16) & 0xFF;
    const baseG = (baseArgb >> 8) & 0xFF;
    const baseB = baseArgb & 0xFF;
    
    const blendR = (blendArgb >> 16) & 0xFF;
    const blendG = (blendArgb >> 8) & 0xFF;
    const blendB = blendArgb & 0xFF;
    
    let resultR: number, resultG: number, resultB: number;
    
    switch (mode) {
        case 'multiply':
            resultR = (baseR * blendR) / 255;
            resultG = (baseG * blendG) / 255;
            resultB = (baseB * blendB) / 255;
            break;
        case 'screen':
            resultR = 255 - ((255 - baseR) * (255 - blendR)) / 255;
            resultG = 255 - ((255 - baseG) * (255 - blendG)) / 255;
            resultB = 255 - ((255 - baseB) * (255 - blendB)) / 255;
            break;
        case 'overlay':
            resultR = baseR < 128 ? (2 * baseR * blendR) / 255 : 255 - 2 * ((255 - baseR) * (255 - blendR)) / 255;
            resultG = baseG < 128 ? (2 * baseG * blendG) / 255 : 255 - 2 * ((255 - baseG) * (255 - blendG)) / 255;
            resultB = baseB < 128 ? (2 * baseB * blendB) / 255 : 255 - 2 * ((255 - baseB) * (255 - blendB)) / 255;
            break;
    }
    
    // Apply opacity
    resultR = Math.round(resultR * opacity + baseR * (1 - opacity));
    resultG = Math.round(resultG * opacity + baseG * (1 - opacity));
    resultB = Math.round(resultB * opacity + baseB * (1 - opacity));
    
    return hexFromArgb((0xFF << 24) | (resultR << 16) | (resultG << 8) | resultB);
}

/**
 * Gets disabled state colors
 * @param color Base color in hex
 * @returns Object with color and opacity
 */
export function getDisabledState(color: string) {
    const hct = Hct.fromInt(argbFromHex(color));
    const newHct = Hct.from(hct.hue, hct.chroma, 70);
    return {
        color: hexFromArgb(newHct.toInt()),
        opacity: 0.38
    };
}

/**
 * Applies color scheme to CSS variables
 * @param scheme Color scheme
 * @param prefix CSS variable prefix
 * @returns Record of CSS variable declarations
 */
export function schemeToCssVariables(
    scheme: SchemeContent,
    prefix: string = '--md-sys-color'
): Record<string, string> {
    const variables: Record<string, string> = {};
    
    // Convert scheme properties to CSS variables
    for (const [key, value] of Object.entries(scheme)) {
        if (typeof value === 'number') {
            const cssKey = `${prefix}-${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`;
            variables[cssKey] = hexFromArgb(value);
        }
    }

    return variables;
} 