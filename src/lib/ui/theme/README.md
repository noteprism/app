# Theme System

A Material Design 3 theme system that generates color schemes from a brand color.

## Usage

```svelte
<script>
import provider from '$lib/ui/theme/provider.svelte';
</script>

<provider initialBrandColor="#2CD2ED">
  <!-- Your app content -->
</provider>
```

## Features
- Dynamic theme generation from brand color
- Light/dark mode with system preference sync
- CSS variables for all Material Design 3 color roles

## Color Variables

### Brand Colors
- `--md-sys-color-primary`
- `--md-sys-color-on-primary`
- `--md-sys-color-primary-container`
- `--md-sys-color-on-primary-container`

### Secondary Colors
- `--md-sys-color-secondary`
- `--md-sys-color-on-secondary`
- `--md-sys-color-secondary-container`
- `--md-sys-color-on-secondary-container`

### Surface Colors
- `--md-sys-color-surface`
- `--md-sys-color-on-surface`
- `--md-sys-color-surface-dim`
- `--md-sys-color-surface-bright`
- `--md-sys-color-surface-container-lowest`
- `--md-sys-color-surface-container-low`
- `--md-sys-color-surface-container`
- `--md-sys-color-surface-container-high`
- `--md-sys-color-surface-container-highest`

### Utility Colors
- `--md-sys-color-outline`
- `--md-sys-color-outline-variant`
- `--md-sys-color-shadow`
- `--md-sys-color-scrim`
- `--md-sys-color-error`
- `--md-sys-color-on-error`

## Files
- `store.ts` - Theme state management and color scheme generation
- `provider.svelte` - Theme application component 