/**
 * Material Color Utilities wrapper for Noteprism
 * Provides color conversion and theme generation utilities
 */

import {
    argbFromHex,
    hexFromArgb,
    themeFromSourceColor
} from '@material/material-color-utilities';

export {
    argbFromHex,
    hexFromArgb,
    themeFromSourceColor
};

// Re-export types we use
export type { Theme } from '@material/material-color-utilities'; 