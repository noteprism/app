import { argbFromHex, hexFromArgb, themeFromSourceColor } from './color';
import { expect, test, describe } from 'vitest';

describe('color utilities', () => {
    test('converts hex to argb and back', () => {
        const hex = '#2cd2ed';
        const argb = argbFromHex(hex);
        expect(hexFromArgb(argb)).toBe(hex);
    });

    test('generates theme from source color', () => {
        const theme = themeFromSourceColor('#2cd2ed');
        expect(theme).toBeDefined();
        expect(theme.schemes).toBeDefined();
        expect(theme.schemes.light).toBeDefined();
        expect(theme.schemes.dark).toBeDefined();
    });
}); 