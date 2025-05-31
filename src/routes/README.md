# Routes Directory

[← Back to root](../../README.md)

This directory contains all the routes and pages for the Noteprism application, built with Svelte 5.

## Files
- `+page.svelte` - Landing page with simple status overview
  - Welcome message
  - Quick status indicator (✔️/⛔) using reactive variables
  - Link to detailed status page
  - Auto-refreshes every 30 seconds

## Directories
- [api/](api/README.md) - API endpoints for health checks and system status
- [status/](status/README.md) - Detailed system status page with health check history 