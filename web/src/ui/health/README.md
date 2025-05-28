# Health Monitoring Components

This directory contains components related to health monitoring and status checking of our GCP-hosted services.

## Files

### `gcp.ts`
A web component that monitors the health of our Google Cloud Platform services:
- Implements the `<api-status>` custom element
- Automatically checks health endpoints based on the current hostname:
  - Production: https://api-768383813386.us-central1.run.app/health
  - Preview: https://preview-768383813386.us-central1.run.app/health
- Displays a visual indicator of API health status using Ionic components
- Updates status in real-time when the component is mounted

## Related Documentation
- [Root Documentation](../../../../README.md)
- [Web Source Documentation](../../README.md)
- [API Documentation](../../../../api/src/README.md) - For the health endpoint implementation 