import { describe, it, expect } from 'vitest';
import { argbFromHex, hexFromArgb, themeFromSourceColor } from './color';

describe('Material Color Utilities Integration', () => {
    describe('Color Conversion', () => {
        it('should correctly convert hex to ARGB and back', () => {
            const red = argbFromHex('#ff0000');
            const green = argbFromHex('#00ff00');
            const blue = argbFromHex('#0000ff');
            const white = argbFromHex('#ffffff');
            const black = argbFromHex('#000000');

            // ARGB format: 0xAARRGGBB
            expect(hexFromArgb(red)).toBe('#ff0000');
            expect(hexFromArgb(green)).toBe('#00ff00');
            expect(hexFromArgb(blue)).toBe('#0000ff');
            expect(hexFromArgb(white)).toBe('#ffffff');
            expect(hexFromArgb(black)).toBe('#000000');
        });

        it('should handle invalid hex codes appropriately', () => {
            // Non-hex string throws error
            expect(() => argbFromHex('not-a-hex')).toThrow('unexpected hex not-a-hex');
            
            // Invalid hex format returns black (0xFF000000 in ARGB)
            const black = 4278190080; // 0xFF000000 in decimal
            expect(argbFromHex('#xyz')).toBe(black);
        });
    });

    describe('Theme Generation', () => {
        it('should generate a complete theme from source color', () => {
            const sourceColor = argbFromHex('#6750A4'); // Material Design default purple
            const theme = themeFromSourceColor(sourceColor);

            expect(theme.schemes).toBeDefined();
            expect(theme.schemes.light).toBeDefined();
            expect(theme.schemes.dark).toBeDefined();

            // Check that all essential colors are present
            const lightScheme = theme.schemes.light;
            expect(lightScheme.primary).toBeDefined();
            expect(lightScheme.secondary).toBeDefined();
            expect(lightScheme.tertiary).toBeDefined();
            expect(lightScheme.error).toBeDefined();
            expect(lightScheme.surface).toBeDefined();
        });

        it('should generate different schemes for light and dark modes', () => {
            const sourceColor = argbFromHex('#6750A4');
            const theme = themeFromSourceColor(sourceColor);

            expect(theme.schemes.light.primary).not.toBe(theme.schemes.dark.primary);
            expect(theme.schemes.light.surface).not.toBe(theme.schemes.dark.surface);
        });
    });
}); 