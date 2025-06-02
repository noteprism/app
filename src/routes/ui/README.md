# UI System Documentation

[← Back to routes](../README.md)

Interactive documentation and showcase of the Noteprism UI system.

## Features

### Theme Controls
- HCT color space controls:
  - Hue (0-360)
  - Chroma (0-150)
  - Tone (0-100)
- Color picker for direct color selection
- Light/dark mode toggle
- Real-time theme preview

### Color System
Displays all Material Design 3 color roles:
- Brand colors (primary, secondary, tertiary)
- Surface colors and variants
- Utility colors (error, outline, etc.)
- Content colors (on-colors)

### Design Tokens
Documentation of design system tokens:
- Typography scales
- Spacing units
- Corner radius values
- Elevation levels

### Component Library
Showcase of UI components:
- Layout components
- Data display elements
- Interactive controls
- Status indicators

## Implementation

The page is built using:
- Svelte 5 for reactivity
- Material Design 3 color system
- HCT color space for dynamic theming
- CSS custom properties for tokens

## Development

To add new components to the showcase:
1. Create component in appropriate directory
2. Add to relevant section in `+page.svelte`
3. Include usage examples and props documentation
4. Test in both light and dark modes 