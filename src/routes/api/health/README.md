# Health API Endpoints

[← Back to API](../README.md)

This directory contains the health check endpoints that monitor system status.

## Structure
- `server/` - Server health monitoring endpoint
- `database/` - Database connectivity monitoring endpoint
- `history/` - Historical health check data endpoint

## Response Format
All health check endpoints return data in a consistent format:
```json
{
    "service": "string",     // Name of the service
    "status": "string",      // 'operational' or 'error'
    "latency": number,       // Response time in milliseconds
    "timestamp": "string",   // ISO timestamp
    "message": "string"      // Optional status message
}
```

The history endpoint returns an array of these objects, sorted newest first.

## Testing
The health check functionality is thoroughly tested:

### Core Functions (`/src/lib/server/health.test.ts`)
- ✓ Latency measurement
- ✓ Database health checks
- ✓ Server health monitoring
- ✓ Memory usage thresholds
- ✓ Health check record creation

### Upcoming Tests
- API endpoint integration tests
- Historical data retrieval
- Error handling scenarios 