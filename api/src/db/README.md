# Database Connections

This directory contains database connection and management code.

## Files

### `mongodb.ts`
MongoDB connection manager that:
- Implements a singleton pattern for the MongoDB client
- Securely retrieves connection string from Google Cloud Secret Manager
- Provides connection error handling and logging
- Exports functions:
  - `connectToMongoDB()`: Establishes initial connection
  - `getMongoClient()`: Returns existing client or creates new connection

### Environment Setup
The MongoDB connection requires:
- Google Cloud Secret Manager access
- Secret named `MONGODB_URI` in project `768383813386`
- Google Cloud service account with Secret Manager access permissions

## Usage Example
```typescript
import { getMongoClient } from './db/mongodb';

async function example() {
  const client = await getMongoClient();
  const db = client.db('your_database_name');
  // Use db for operations...
}
```

## Related Documentation
- [API Documentation](../README.md)
- [Root Documentation](../../../README.md) 