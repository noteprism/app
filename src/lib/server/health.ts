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
        status,
        latency: Math.round(latency),
        timestamp: healthCheck.timestamp,
        message
    };
}

export async function checkServerHealth() {
    const start = performance.now();
    const memory = process.memoryUsage();
    const latency = performance.now() - start;

    const healthCheck = await prisma.healthCheck.create({
        data: {
            service: 'server',
            status: 'operational',
            latency,
            message: `Memory usage: ${Math.round(memory.heapUsed / 1024 / 1024)}MB`
        }
    });

    return {
        status: 'operational',
        latency: Math.round(latency),
        timestamp: healthCheck.timestamp,
        memory: {
            heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
            rss: Math.round(memory.rss / 1024 / 1024)
        }
    };
}

export async function getHealthHistory() {
    const checks = await prisma.healthCheck.findMany({
        orderBy: { timestamp: 'desc' },
        take: 50,  // Show last 50 checks
        select: {
            service: true,
            status: true,
            latency: true,
            timestamp: true,
            message: true
        }
    });

    return checks.reverse(); // Return in chronological order
} 