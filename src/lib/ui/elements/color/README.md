# Color Scale Component

A simple component that displays Material Design 3 color scales. Shows the base color and its variants including:

- Base color (e.g. `--md-sys-color-primary`)
- On-color (e.g. `--md-sys-color-on-primary`) 
- Container color (e.g. `--md-sys-color-primary-container`)
- On-container color (e.g. `--md-sys-color-on-primary-container`)

## Usage

```svelte
<script>
import { scale } from '$lib/ui/color/scale.svelte';
</script>

<scale name="Primary" baseVar="primary" />
<scale name="Secondary" baseVar="secondary" />
<scale name="Surface" baseVar="surface" showOnColors={false} />
```

## Props

- `name`: Display name for the color scale
- `baseVar`: Base variable name (e.g. "primary", "secondary", "surface")
- `showOnColors`: Whether to show the on-colors (default: true) 