import { MongoClient } from 'mongodb';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

let client: MongoClient | null = null;

export async function connectToMongoDB() {
    if (client) return client;

    try {
        // Access the MongoDB URI from Secret Manager
        const secretClient = new SecretManagerServiceClient();
        const [version] = await secretClient.accessSecretVersion({
            name: 'projects/768383813386/secrets/MONGODB_URI/versions/latest'
        });

        const mongoUri = version.payload?.data?.toString() || '';
        if (!mongoUri) {
            throw new Error('MongoDB URI not found in secret manager');
        }

        // Create and connect MongoDB client
        client = new MongoClient(mongoUri);
        await client.connect();
        console.log('Connected to MongoDB');
        return client;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

export async function getMongoClient() {
    if (!client) {
        await connectToMongoDB();
    }
    return client;
} 