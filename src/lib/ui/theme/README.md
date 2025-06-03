# Theme System

[← Back to UI](../README.md)

A Material Design 3 theme system that uses HCT (Hue, Chroma, Tone) color space for precise and accessible color generation.

## Implementation Status

✅ Completed:
- HCT color space implementation
- Dynamic theme generation from source color
- Light/dark mode with system preference sync
- CSS variables for Material Design 3 color roles
- Surface system implementation
- Color scale components

⏳ Next Steps:
- Typography system
- Elevation system
- Component theming guidelines
- Theme transition animations

## Files
- `store.ts` - Theme state management and color scheme generation
- `store.test.ts` - Theme store unit tests
- `tokens.ts` - Theme tokens and color space utilities

## Surface System

Our implementation follows Material Design 3's surface system for consistent elevation and hierarchy:

### Base Surfaces
- `--md-sys-color-surface` - Primary surface color
- `--md-sys-color-on-surface` - Text and icons on primary surface
- `--md-sys-color-surface-variant` - Alternative surface for distinct areas
- `--md-sys-color-on-surface-variant` - Text and icons on surface variant

### Surface Containers (Elevation)
Used to create hierarchy through subtle elevation differences:
1. `--md-sys-color-surface-container-lowest` - Base level containers
2. `--md-sys-color-surface-container-low` - Slightly elevated containers
3. `--md-sys-color-surface-container` - Standard containers
4. `--md-sys-color-surface-container-high` - Higher emphasis containers
5. `--md-sys-color-surface-container-highest` - Highest emphasis containers

### Special Surfaces
- `--md-sys-color-surface-dim` - Dimmed surface for reduced emphasis
- `--md-sys-color-surface-bright` - Bright surface for increased emphasis
- `--md-sys-color-inverse-surface` - Inverse surface for contrast

## Usage

### Theme Colors
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
</script>
```

### Surface Usage
```svelte
<div class="card">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>

<style>
  .card {
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px var(--md-sys-color-shadow);
  }
</style>
```

## Proposed Tests

### Surface System Tests
- Verify correct surface color generation for light/dark modes
- Test surface container color relationships (lowest to highest)
- Validate contrast ratios between surfaces and on-surface colors
- Test surface color updates when theme source color changes

### Theme Store Tests
- Test theme updates with HCT value changes
- Verify correct color space conversions
- Test system preference change handling
- Validate theme persistence across page reloads

### Component Tests
- Test color scale component rendering
- Verify theme control inputs
- Test surface container hierarchy
- Validate color contrast accessibility

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