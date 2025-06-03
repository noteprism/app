# Library Directory

This directory contains shared libraries, components, and utilities used throughout the application.

## Directory Structure

- `/server` - Server-side utilities and database interactions
- `/stores` - Svelte stores for state management
- `/ui` - UI components and theme system
  - `/components` - Reusable UI components
  - `/theme` - Material Design 3 theme system

## Key Files

- `stores/theme.ts` - Theme management and persistence
- `server/auth.ts` - Authentication utilities
- `server/db.ts` - Database utilities

## Usage

Import components and utilities using the `$lib` alias:

```typescript
import { themeTokens } from '$lib/stores/theme';
import { auth } from '$lib/server/auth';
```

## Files
- `variables.ts` - Configuration variables and environment settings

## Directories
- [server/](server/README.md) - Server-side utilities and functions
- [ui/](ui/README.md) - UI system and components
  - [components/](ui/components/README.md) - Reusable UI components
  - [elements/](ui/elements/README.md) - Basic UI building blocks
  - [utils/](ui/utils/README.md) - UI-specific utilities

## UI System

The application uses Material You's dynamic color system through the `@material/material-color-utilities` package. This provides:

- Dynamic color generation from source colors
- Accessibility-focused color contrast tools
- Color harmonization and blending utilities
- Temperature-based color relationships

For detailed documentation on the UI system and available components, see [ui/README.md](ui/README.md). 