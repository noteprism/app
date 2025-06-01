# Theme Directory

[← Back to lib](../README.md)

This directory contains theme-related utilities and configurations using the Material Color Utilities package.

## Material Color Utilities Integration

We use `@material/material-color-utilities` for dynamic color theming. Our color scheme is based on the Noteprism logo colors:

```typescript
const brandColors = {
  primary: '#2CD2ED',
  secondary: '#7A959C',
  tertiary: '#868FB6',
  error: '#FF5449',
  neutral: '#8E9192',
  neutralVariant: '#899295'
}
```

### How to Use (ELI5 Style)

1. **Basic Color Usage**
   ```typescript
   import { theme } from '$lib/theme';
   
   // Use in your styles:
   const myElement = {
     backgroundColor: theme.surfaces.primary,
     color: theme.text.onPrimary
   }
   ```

2. **Dynamic Surface Colors**
   - Light surfaces: `theme.surfaces.surface1` through `theme.surfaces.surface5`
   - Dark surfaces automatically adjust in dark mode

3. **Text Colors**
   - Primary text: `theme.text.primary`
   - Secondary text: `theme.text.secondary`
   - On-color text (for text on colored backgrounds):
     - `theme.text.onPrimary`
     - `theme.text.onSecondary`
     - `theme.text.onTertiary`

4. **State Colors**
   - Hover states: `theme.states.hover`
   - Focus states: `theme.states.focus`
   - Pressed states: `theme.states.pressed`

5. **Color Roles**
   - Primary actions: `theme.roles.primaryAction`
   - Secondary actions: `theme.roles.secondaryAction`
   - Backgrounds: `theme.roles.background`
   - Surfaces: `theme.roles.surface`

## Files
- `index.ts` - Main theme configuration and exports
- `colors.ts` - Color scheme definitions and utilities
- `surfaces.ts` - Surface color utilities
- `text.ts` - Text color utilities
- `states.ts` - State color utilities

## Usage Examples

### In Svelte Components
```svelte
<script lang="ts">
  import { theme } from '$lib/theme';
</script>

<div class="my-component">
  <h1>Hello World</h1>
</div>

<style>
  .my-component {
    background-color: var(--surface1);
    color: var(--text-primary);
  }

  h1 {
    color: var(--primary);
  }
</style>
```

### CSS Variables
All colors are also available as CSS variables:
- `--primary`
- `--on-primary`
- `--secondary`
- `--on-secondary`
- `--surface1` through `--surface5`
- `--text-primary`
- `--text-secondary` 