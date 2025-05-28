# API Source

This directory contains the source code for the backend API service.

## Files

### `index.ts`
The main API server implementation:
- Sets up an Express.js server with security middleware:
  - CORS configuration for allowed origins (preview.noteprism.com, noteprism.com)
  - Helmet for security headers
  - Compression for response optimization
- Implements the `/health` endpoint for service health monitoring
- Configures JSON request parsing
- Handles server initialization and port configuration

## Related Documentation
- [Root Documentation](../../README.md)
- [Web Source Documentation](../../web/src/README.md)
- [Health Component Documentation](../../web/src/ui/health/README.md) 