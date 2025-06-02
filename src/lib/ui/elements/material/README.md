# Material Design 3 Elements

[← Back to elements](../README.md)

Core Material Design 3 elements and utilities for Noteprism.

## Color System

### HCT Color Space
We use Material Design 3's HCT (Hue, Chroma, Tone) color space for all color operations:
- Hue: Color's position on the color wheel (0-360)
- Chroma: Color's colorfulness/saturation
- Tone: Color's lightness (0-100)

### Surface System
Surface colors are generated with specific tonal values:

#### Light Theme
- Surface: 98 tone
- Surface Dim: 87 tone
- Surface Container Lowest: 100 tone
- Surface Container Low: 96 tone
- Surface Container: 94 tone
- Surface Container High: 92 tone
- Surface Container Highest: 90 tone

#### Dark Theme
- Surface: 6 tone
- Surface Dim: 6 tone
- Surface Container Lowest: 4 tone
- Surface Container Low: 10 tone
- Surface Container: 12 tone
- Surface Container High: 17 tone
- Surface Container Highest: 22 tone

### State Layers
Interactive state layers with standard opacities:
- Hover: 8% opacity
- Focus: 12% opacity
- Pressed: 12% opacity
- Dragged: 16% opacity

### Color Blending
Support for multiple blend modes:
- Multiply: Darkens colors
- Screen: Lightens colors
- Overlay: Increases contrast

## Usage Examples

### Color Conversion
```typescript
import { argbFromHex, hexFromArgb } from '@material/material-color-utilities';

// Convert hex to ARGB
const argb = argbFromHex('#2CD2ED');

// Convert ARGB to hex
const hex = hexFromArgb(argb);
```

### Theme Generation
```typescript
import { themeFromSourceColor } from '@material/material-color-utilities';

const theme = themeFromSourceColor(argbFromHex('#2CD2ED'));
```

### Surface Colors
```typescript
import { getSurfaceColor } from '$lib/ui/theme/color';

const surfaceColor = getSurfaceColor(theme, 'surface', isDark);
const containerColor = getSurfaceColor(theme, 'surfaceContainer', isDark);
```

### State Layers
```typescript
import { getStateLayer } from '$lib/ui/theme/color';

const hoverColor = getStateLayer(baseColor, 'hover');
const pressedColor = getStateLayer(baseColor, 'pressed');
```

### Color Blending
```typescript
import { blendColors } from '$lib/ui/theme/color';

const blended = blendColors(baseColor, overlayColor, 'multiply', 0.5);
```

## Implementation Status

✅ **Completed**
- HCT color space support
- Dynamic theme generation
- Surface container system
- State layer utilities
- Color blending functions

⏳ **Next Steps**
1. Add color harmonization
2. Implement color role inheritance
3. Add color accessibility checks
4. Create color manipulation utilities 