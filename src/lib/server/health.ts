import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function measureLatency(fn: () => Promise<any>): Promise<{ latency: number; error?: Error }> {
    const start = performance.now();
    try {
        await fn();
        return { latency: performance.now() - start };
    } catch (error) {
        return { latency: performance.now() - start, error: error as Error };
    }
}

export async function checkDatabaseHealth() {
    const { latency, error } = await measureLatency(async () => {
        await prisma.$queryRaw`SELECT 1`;
    });

    const status = error ? 'error' : 'operational';
    const message = error?.message;

    const healthCheck = await prisma.healthCheck.create({
        data: {
            service: 'database',
            status,
            latency,
            message
        }
    });

    return {
        service: 'database',
        status,
        latency,
        timestamp: healthCheck.timestamp,
        message
    };
}

export async function checkServerHealth() {
    const { latency, error } = await measureLatency(async () => {
        const memory = process.memoryUsage();
        if (memory.heapUsed / memory.heapTotal > 0.9) {
            throw new Error('High memory usage');
        }
    });

    const status = error ? 'error' : 'operational';
    const message = error?.message;

    const healthCheck = await prisma.healthCheck.create({
        data: {
            service: 'server',
            status,
            latency,
            message
        }
    });

    return {
        service: 'server',
        status,
        latency,
        timestamp: healthCheck.timestamp,
        message
    };
}

export async function getHealthHistory() {
    return await prisma.healthCheck.findMany({
        orderBy: { timestamp: 'desc' },
        take: 50,
        select: {
            service: true,
            status: true,
            latency: true,
            timestamp: true,
            message: true
        }
    });
} 