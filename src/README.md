# Source Directory

[← Back to root](../README.md)

## Structure
- `app.html` - SvelteKit HTML template
- `app.d.ts` - TypeScript declarations

## Directories
- [lib/](lib/README.md)
  - [components/](lib/components/README.md) - UI components
  - [theme/](lib/theme/README.md) - Material Design theme
  - [styles/](lib/styles/README.md) - Global styles
- [routes/](routes/README.md) - SvelteKit pages & API

## SvelteKit Files
Files prefixed with `+` are SvelteKit routing files:
- `+page.svelte` - Pages
- `+layout.svelte` - Layouts
- `+server.ts` - API endpoints
- `+error.svelte` - Error pages

## Theme System
The application uses Material Design's color system through `@material/material-color-utilities`. The theme is based on the Noteprism logo colors and provides:
- Light/dark mode support
- Dynamic surface system
- Consistent text contrast
- Semantic color roles

See the [theme documentation](lib/theme/README.md) for detailed usage. 