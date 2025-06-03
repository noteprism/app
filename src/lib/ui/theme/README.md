# Theme System

[← Back to UI](../README.md)

A Material Design 3 theme system that uses HCT (Hue, Chroma, Tone) color space for precise and accessible color generation.

## Files
- `store.ts` - Theme state management and color scheme generation
- `store.test.ts` - Theme store unit tests
- `tokens.ts` - Theme tokens and color space utilities
- `provider.svelte` - Theme application component

## Test Coverage

### Theme Store Tests (`store.test.ts`)
- Dark mode initialization from system preference
- Manual dark mode updates
- System preference change handling

### Color Utilities Tests (`material/color.test.ts`)
- Hex to ARGB conversion
- ARGB to hex conversion
- Theme generation from source color

## Usage

```svelte
<script>
import { themeTokens } from '$lib/ui/theme/store';

// Update theme using HCT values
themeTokens.update(tokens => ({
    source: {
        hue: 190,    // 0-360
        chroma: 70,  // 0-150
        tone: 65     // 0-100
    }
}));

// Or use hex colors that will be converted to HCT
import { hexToHct } from '$lib/ui/theme/tokens';
const hct = hexToHct('#2CD2ED');
themeTokens.update(tokens => ({
    source: hct
}));
</script>
```

## Features
- HCT color space for precise color control
- Dynamic theme generation from source color
- Light/dark mode with system preference sync
- CSS variables for all Material Design 3 color roles
- Utility functions for color space conversion

## Color System

### HCT Color Space
The theme system uses the HCT (Hue, Chroma, Tone) color space, which provides several advantages:
- Better perceptual uniformity
- Built-in accessibility considerations
- More intuitive color adjustments
- Consistent with Material Design 3 specifications

Parameters:
- **Hue** (0-360): The color's position on the color wheel
- **Chroma** (0-150): The color's colorfulness or saturation
- **Tone** (0-100): The color's lightness

### Color Tokens
All color tokens follow the Material Design 3 naming convention `--md-sys-color-<token>`.
Each color (except special surfaces) has a corresponding `on-` token for content colors.

#### Brand Colors
- `--md-sys-color-primary`
- `--md-sys-color-on-primary`
- `--md-sys-color-primary-container`
- `--md-sys-color-on-primary-container`
- `--md-sys-color-secondary`
- `--md-sys-color-on-secondary`
- `--md-sys-color-secondary-container`
- `--md-sys-color-on-secondary-container`
- `--md-sys-color-tertiary`
- `--md-sys-color-on-tertiary`
- `--md-sys-color-tertiary-container`
- `--md-sys-color-on-tertiary-container`

#### Surface Colors
- `--md-sys-color-surface`
- `--md-sys-color-on-surface`
- `--md-sys-color-surface-dim`
- `--md-sys-color-surface-bright`
- `--md-sys-color-surface-container-lowest`
- `--md-sys-color-surface-container-low`
- `--md-sys-color-surface-container`
- `--md-sys-color-surface-container-high`
- `--md-sys-color-surface-container-highest`

#### Utility Colors
- `--md-sys-color-outline`
- `--md-sys-color-outline-variant`
- `--md-sys-color-shadow`
- `--md-sys-color-scrim`
- `--md-sys-color-error`
- `--md-sys-color-on-error`
- `--md-sys-color-error-container`
- `--md-sys-color-on-error-container`

## References
- [Material Design 3 Color System](https://m3.material.io/styles/color/overview)
- [HCT Color Space](https://material.io/blog/science-of-color-design) 