# Status Page

This directory contains the detailed system status page that shows the complete health check history for all services, implemented using Svelte 5's reactivity.

## Features

- Comprehensive health check history using reactive variables
- Manual refresh on page load and status click
- Complete system health overview
- Historical uptime tracking

## Files
- `+page.svelte` - Detailed status page
  - Comprehensive health check history using reactive variables
  - Real-time updates every 30 seconds
  - Reverse chronological order (newest first)
  - Service type labeling (Server/Database)
  - Latency metrics and error messages
  - Back navigation to home page 