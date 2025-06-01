# Theme Directory

[← Back to lib](../README.md)

Material Design theme system using `@material/material-color-utilities`.

## Files
- `colors.ts` - Core color definitions and theme generation
- `store.ts` - CSS variable management
- `index.ts` - Theme exports

## Brand Colors
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

## CSS Variables

### Light Mode
- `--surface1` through `--surface5` - Surface colors
- `--on-surface` - Text on surface
- `--on-surface-variant` - Secondary text
- `--shadow-low/medium/high` - Elevation shadows

### Dark Mode
- `--dark-surface1` through `--dark-surface5`
- `--dark-on-surface`
- `--dark-on-surface-variant`
- `--dark-shadow-low/medium/high`

## Usage

```svelte
<style>
  .my-component {
    /* Light mode automatically switches to dark mode */
    background: var(--surface1);
    color: var(--on-surface);
  }

  /* Status colors */
  .error { background: var(--error); }
  .success { background: var(--surface5); }
</style>
``` 