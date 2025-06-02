# UI Components

[← Back to UI](../README.md)

This directory contains all reusable UI components for Noteprism. Components are organized by their complexity and purpose.

## Implementation Status

⏳ Planned Components

### Layout Components
- Header Navigation
- Sidebar Navigation
- Main Content Area
- Status Bar
- Grid Layout System

### Data Display
- Note Card
- Task Card
- Content Preview
- Tag Display
- Connection Map

### Interactive Elements
- Quick Capture Button
- Tag Input
- Priority Selector
- Platform Selector
- Content Type Toggle

## Development Guidelines

Each component will:
1. Be self-contained in its own directory
2. Use Material You theming via our utils
3. Include comprehensive tests
4. Follow accessibility best practices
5. Include documentation and examples

## Testing

Components should have tests for:
- Rendering
- User interactions
- Theme application
- Accessibility
- Edge cases

## Components

### ColorScale.svelte
A component for displaying Material You color scales with their CSS variable names.

#### Props
- `name: string` - Display name for the color scale
- `baseVar: string` - Base CSS variable name (e.g. "primary", "surface")
- `showOnColors: boolean` - Whether to show "on" colors (default: true)

#### Usage
```svelte
<script>
    import ColorScale from '$lib/ui/components/ColorScale.svelte';
</script>

<ColorScale name="Primary" baseVar="primary" />
<ColorScale name="Surface" baseVar="surface" />
<ColorScale name="Outline" baseVar="outline" showOnColors={false} />
```

#### Features
- Displays color swatches with CSS variable names
- Shows base color and "on" color pairs
- Shows container colors when applicable
- Responsive layout with monospace font for variables
- Semi-transparent variable name overlays
- Automatic text contrast with backgrounds 