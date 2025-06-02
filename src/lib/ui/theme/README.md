# Theme System

[← Back to UI](../README.md)

A dynamic theme system using Material You's color utilities to generate consistent, accessible color schemes.

## Features

### Color System
- Dynamic theme generation from brand color
- Light/dark mode support with system preference sync
- Complete Material Design 3 color roles
- Surface container system for elevation
- State layer handling for interactions

### Surface System
We implement Material Design 3's complete surface system:

#### Base Surfaces
- Surface (98 tone in light, 6 in dark)
- Surface Dim (87 tone in light, 6 in dark)
- Surface Bright (98 tone in light, 24 in dark)

#### Surface Containers (Elevation)
- Surface Container Lowest (100 tone in light, 4 in dark)
- Surface Container Low (96 tone in light, 10 in dark)
- Surface Container (94 tone in light, 12 in dark)
- Surface Container High (92 tone in light, 17 in dark)
- Surface Container Highest (90 tone in light, 22 in dark)

### State Layers
Interaction states with proper opacity values:
- Hover: 8% opacity
- Focus: 12% opacity
- Pressed: 12% opacity
- Dragged: 16% opacity
- Disabled: 38% opacity

### Color Utilities
- HCT color space manipulation
- Tonal palette generation
- Color blending modes (multiply, screen, overlay)
- State layer color generation
- Disabled state handling

## Usage

### Basic Theme Setup
```svelte
<script>
import { ThemeProvider } from './ThemeProvider.svelte';
</script>

<ThemeProvider>
  <!-- Your app content -->
</ThemeProvider>
```

### Custom Brand Color
```svelte
<ThemeProvider initialBrandColor="#2CD2ED">
  <!-- Your app content -->
</ThemeProvider>
```

### Manual Dark Mode
```svelte
<script>
import { isDarkMode } from './store';

function toggleTheme() {
    isDarkMode.update(dark => !dark);
}
</script>
```

## Implementation Status

✅ **Completed**
- Material You color system integration
- Dynamic theme generation
- Light/dark scheme support
- Surface container system
- Color role mapping
- State layer system
- Color blending utilities

⏳ **Next Steps**
1. Add theme persistence
2. Create color picker component
3. Add color scheme preview
4. Implement color role inheritance

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

### Tertiary Colors
- `--md-sys-color-tertiary`
- `--md-sys-color-on-tertiary`
- `--md-sys-color-tertiary-container`
- `--md-sys-color-on-tertiary-container`

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
- `--md-sys-color-surface-variant`
- `--md-sys-color-on-surface-variant`

### Utility Colors
- `--md-sys-color-outline`
- `--md-sys-color-outline-variant`
- `--md-sys-color-shadow`
- `--md-sys-color-scrim`
- `--md-sys-color-error`
- `--md-sys-color-on-error`
- `--md-sys-color-error-container`
- `--md-sys-color-on-error-container`

## Files
- `store.ts` - Theme state management and color scheme generation
  - Brand color store (defaults to Sky: #2CD2ED)
  - Dark mode preference store
  - Dynamic theme generation
  - CSS variable management
- `ThemeProvider.svelte` - Theme application component
  - System dark mode detection
  - Theme transitions
  - Dynamic theme updates

## Usage

1. Wrap your app with the theme provider:
```svelte
<script>
    import ThemeProvider from '$lib/ui/theme/ThemeProvider.svelte';
    
    // Optional: Initial brand color from database/settings
    // Defaults to Sky (#2CD2ED) if not provided
    let brandColor = '#2CD2ED';
</script>

<ThemeProvider initialBrandColor={brandColor}>
    <App />
</ThemeProvider>
```

2. Use theme stores in components:
```svelte
<script>
    import { brandColor, isDarkMode, theme } from '$lib/ui/theme/store';
    
    // Update brand color
    function updateBrandColor(newColor: string) {
        brandColor.set(newColor);
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        isDarkMode.update(dark => !dark);
    }
</script>
```

3. Use CSS variables in styles:
```css
.my-component {
    background: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
}
```

## Color Variables

### Primary Colors
- `--md-sys-color-primary`
- `--md-sys-color-on-primary`
- `--md-sys-color-primary-container`
- `--md-sys-color-on-primary-container`

### Secondary Colors
- `--md-sys-color-secondary`
- `--md-sys-color-on-secondary`
- `--md-sys-color-secondary-container`
- `--md-sys-color-on-secondary-container`

### Tertiary Colors
- `--md-sys-color-tertiary`
- `--md-sys-color-on-tertiary`
- `--md-sys-color-tertiary-container`
- `--md-sys-color-on-tertiary-container`

### Error Colors
- `--md-sys-color-error`
- `--md-sys-color-on-error`
- `--md-sys-color-error-container`
- `--md-sys-color-on-error-container`

### Surface Colors
- `--md-sys-color-surface`
- `--md-sys-color-on-surface`
- `--md-sys-color-surface-variant`
- `--md-sys-color-on-surface-variant`

### Background Colors
- `--md-sys-color-background`
- `--md-sys-color-on-background`

### Other Colors
- `--md-sys-color-outline`
- `--md-sys-color-outline-variant`
- `--md-sys-color-shadow`
- `--md-sys-color-scrim`
- `--md-sys-color-inverse-surface`
- `--md-sys-color-inverse-on-surface`
- `--md-sys-color-inverse-primary`

## Features
- Dynamic color scheme generation from brand color
- Automatic dark mode detection and switching
- Smooth theme transitions
- Type-safe color variable names
- SSR-safe with browser checks
- System color scheme preference sync 