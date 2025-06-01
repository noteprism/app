# Components Directory

[← Back to lib](../README.md)

This directory contains reusable components used throughout the application.

## Components

### `surface.svelte`
Material Design surface component with automatic light/dark mode support.

```svelte
<script>
  import Surface from '$lib/components/surface.svelte';
</script>

<Surface level={1} elevation="medium">
  Content goes here
</Surface>
```

Props:
- `level`: `1 | 2 | 3 | 4 | 5` - Surface elevation level
- `elevation`: `'none' | 'low' | 'medium' | 'high'` - Shadow elevation
- `class_name`: Additional CSS classes 