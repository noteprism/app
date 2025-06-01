# Server Directory

[← Back to root](../../../README.md)

This directory contains server-side utilities and functions.

## Files
- `health.ts` - Health check functions for server and database status monitoring
- `health.test.ts` - Unit tests for health check functions

## Health Check Functions

### measureLatency
A utility function that measures the execution time of any async operation and captures any errors.

```typescript
async function measureLatency(fn: () => Promise<any>): Promise<{ latency: number; error?: Error }>
```

#### Tests
- ✓ Measures time correctly for successful operations
- ✓ Handles errors properly and includes them in result

### checkDatabaseHealth
Checks PostgreSQL database connectivity and response time.

### checkServerHealth
Monitors server memory usage and overall health.

### getHealthHistory
Retrieves historical health check records from the database. 