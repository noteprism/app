# Health History Endpoint

[← Back to health](../README.md)

This endpoint provides historical health check data for all services.

## Files
- `+server.ts` - Health history endpoint
  - Returns complete health check history
  - Includes both server and database checks
  - Provides timestamps and latency data
  - Used by status page for historical display
  - Supports the status overview on landing page 