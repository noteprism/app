# Database Health Endpoint

[← Back to health](../README.md)

This endpoint provides real-time database connectivity and health status information.

## Files
- `+server.ts` - Database health check endpoint
  - Checks database connectivity
  - Returns operational status
  - Includes query latency measurements
  - Reports any database-related errors
  - Used by status pages for health monitoring 