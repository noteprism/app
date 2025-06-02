# Material Design Color Utilities

[← Back to color](../README.md)

Implementation of Material Design 3's color system using the `@material/material-color-utilities` package.

## Files

### color.ts
Core color utilities:
- `argbFromHex(hex: string): number` - Convert hex color to ARGB
- `hexFromArgb(argb: number): string` - Convert ARGB to hex color
- `themeFromSourceColor(hex: string): Theme` - Generate theme from source color

### color.test.ts
Unit tests for color utilities:
- Hex/ARGB conversion
- Theme generation
- Color scheme creation

## Color System

### Theme Generation
The theme generator creates a complete Material Design 3 color scheme from a source color:

1. Converts source color to HCT space
2. Generates primary, secondary, and tertiary colors
3. Creates surface and neutral colors
4. Generates light and dark schemes
5. Ensures accessible contrast ratios

### Color Roles
Generated themes include all Material Design 3 color roles:
- Brand colors (primary, secondary, tertiary)
- Surface colors (background, surface variants)
- State colors (error, success)
- Content colors (on-colors for contrast)

### Usage
```typescript
import { themeFromSourceColor, hexFromArgb } from './color';

// Generate theme from source color
const theme = themeFromSourceColor('#2cd2ed');

// Access light/dark schemes
const lightScheme = theme.schemes.light;
const darkScheme = theme.schemes.dark;

// Convert colors to hex
const primaryColor = hexFromArgb(lightScheme.primary);
```

See [Material Design 3 Color System](https://m3.material.io/styles/color/overview) for more details on the color system.

## Surface Colors

### Light Theme
- Surface: 98 tone
- Surface Dim: 87 tone
- Surface Container Lowest: 100 tone
- Surface Container Low: 96 tone
- Surface Container: 94 tone
- Surface Container High: 92 tone
- Surface Container Highest: 90 tone

### Dark Theme
- Surface: 6 tone
- Surface Dim: 6 tone
- Surface Container Lowest: 4 tone
- Surface Container Low: 10 tone
- Surface Container: 12 tone
- Surface Container High: 17 tone
- Surface Container Highest: 22 tone

## State Layers
Interactive state layers with standard opacities:
- Hover: 8% opacity
- Focus: 12% opacity
- Pressed: 12% opacity
- Dragged: 16% opacity 