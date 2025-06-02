# Color Components

[← Back to elements](../README.md)

Core color components and utilities for Material Design 3, using the HCT (Hue, Chroma, Tone) color space.

## Components

### Scale.svelte

A component that displays Material Design 3 color scales, showing the base color and its variants:

- Base color (e.g. `--md-sys-color-primary`)
- On-color (e.g. `--md-sys-color-on-primary`) 
- Container color (e.g. `--md-sys-color-primary-container`)
- On-container color (e.g. `--md-sys-color-on-primary-container`)

#### Usage

```svelte
<script>
import Scale from '$lib/ui/components/elements/color/scale.svelte';
</script>

<Scale name="Primary" baseVar="primary" />
<Scale name="Secondary" baseVar="secondary" />
<Scale name="Surface" baseVar="surface" showOnColors={false} />
```

#### Props

- `name`: Display name for the color scale
- `baseVar`: Base variable name (e.g. "primary", "secondary", "surface")
- `showOnColors`: Whether to show the on-colors (default: true)

## Material Design Implementation

The color system is implemented using the Material Design 3 color utilities, which provide:

- HCT color space calculations
- Dynamic theme generation
- Color scheme creation
- Accessibility checks

### HCT Color Space
Colors are defined using three parameters:
- **Hue** (0-360): Position on the color wheel
- **Chroma** (0-150): Color intensity/saturation
- **Tone** (0-100): Lightness value

This provides better perceptual uniformity and accessibility than traditional RGB or HSL.

See [material/README.md](material/README.md) for implementation details. 