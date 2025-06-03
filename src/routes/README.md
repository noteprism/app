# Routes Directory

This directory contains all the routes and pages for the application using SvelteKit's file-based routing system.

## Route Structure

- `/` - Home page
- `/ui` - UI System and theme customization
- `/status` - System health monitoring
- `/auth` - Authentication routes
  - `/auth/login` - Login page
  - `/auth/register` - Registration page

## File Types

- `+page.svelte` - Page component
- `+page.ts` - Page load function
- `+layout.svelte` - Layout component
- `+layout.ts` - Layout load function
- `+server.ts` - API endpoints

## API Routes

- `/api/health/*` - Health check endpoints
- `/api/theme/*` - Theme management endpoints
- `/api/auth/*` - Authentication endpoints

## Usage

Each route can have its own:
- Component logic
- Server-side load functions
- API endpoints
- Layouts
- Error handling

[← Back to root](../../README.md)

This directory contains all the routes and pages for the Noteprism application, built with Svelte 5.

## Files
- `+page.svelte` - Landing page with simple status overview
  - Welcome message
  - Quick status indicator (✔️/⛔) using reactive variables
  - Link to UI system documentation
  - Link to detailed status page
  - Auto-refreshes every 30 seconds

## Directories
- [api/](api/README.md) - API endpoints for health checks and system status
- [status/](status/README.md) - Detailed system status page with health check history 
- [ui/](ui/README.md) - UI system documentation and design tokens 