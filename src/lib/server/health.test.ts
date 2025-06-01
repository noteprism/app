import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { measureLatency, checkDatabaseHealth, checkServerHealth } from './health';
import { PrismaClient } from '@prisma/client';

vi.mock('@prisma/client', () => {
  const mockCreate = vi.fn();
  const mockQueryRaw = vi.fn();
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      $queryRaw: mockQueryRaw,
      healthCheck: {
        create: mockCreate
      }
    }))
  };
});

describe('measureLatency', () => {
  let originalNow: () => number;
  let mockNow: ReturnType<typeof vi.fn>;
  let time: number;

  beforeEach(() => {
    originalNow = performance.now;
    mockNow = vi.fn();
    time = 1000;
    mockNow.mockImplementation(() => time);
    (global.performance.now as unknown) = mockNow;
  });

  afterEach(() => {
    (global.performance.now as unknown) = originalNow;
  });

  it('should measure time correctly for successful operations', async () => {
    const mockAsyncFn = async () => {
      time += 100; // Simulate 100ms passing
      return 'success';
    };

    const result = await measureLatency(mockAsyncFn);

    expect(result.latency).toBe(100);
    expect(result.error).toBeUndefined();
  });

  it('should handle errors properly', async () => {
    const mockAsyncFn = async () => {
      time += 50; // Simulate 50ms passing
      throw new Error('Test error');
    };

    const result = await measureLatency(mockAsyncFn);

    expect(result.latency).toBe(50);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('Test error');
  });
});

describe('checkDatabaseHealth', () => {
  let mockPrisma: any;
  let originalNow: () => number;
  let mockNow: ReturnType<typeof vi.fn>;
  let time: number;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = new PrismaClient();
    originalNow = performance.now;
    mockNow = vi.fn();
    time = 1000;
    mockNow.mockImplementation(() => time);
    (global.performance.now as unknown) = mockNow;
  });

  afterEach(() => {
    (global.performance.now as unknown) = originalNow;
  });

  it('should return operational status when DB is healthy', async () => {
    mockPrisma.$queryRaw.mockImplementation(async () => {
      time += 100; // Simulate query taking 100ms
      return [{ 1: 1 }];
    });

    mockPrisma.healthCheck.create.mockImplementation(async (data: any) => ({
      timestamp: new Date(),
      ...data.data
    }));

    const result = await checkDatabaseHealth();

    expect(result.status).toBe('operational');
    expect(result.service).toBe('database');
    expect(result.latency).toBe(100);
    expect(result.message).toBeUndefined();
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(mockPrisma.healthCheck.create).toHaveBeenCalledWith({
      data: {
        service: 'database',
        status: 'operational',
        latency: 100,
        message: undefined
      }
    });
  });

  it('should return error status when DB query fails', async () => {
    const dbError = new Error('Connection failed');
    mockPrisma.$queryRaw.mockImplementation(async () => {
      time += 50; // Simulate query taking 50ms before failing
      throw dbError;
    });

    mockPrisma.healthCheck.create.mockImplementation(async (data: any) => ({
      timestamp: new Date(),
      ...data.data
    }));

    const result = await checkDatabaseHealth();

    expect(result.status).toBe('error');
    expect(result.service).toBe('database');
    expect(result.latency).toBe(50);
    expect(result.message).toBe('Connection failed');
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(mockPrisma.healthCheck.create).toHaveBeenCalledWith({
      data: {
        service: 'database',
        status: 'error',
        latency: 50,
        message: 'Connection failed'
      }
    });
  });
});

describe('checkServerHealth', () => {
  let mockPrisma: any;
  let originalNow: () => number;
  let mockNow: ReturnType<typeof vi.fn>;
  let time: number;
  let originalMemoryUsage: typeof process.memoryUsage;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma = new PrismaClient();
    originalNow = performance.now;
    mockNow = vi.fn();
    time = 1000;
    mockNow.mockImplementation(() => time);
    (global.performance.now as unknown) = mockNow;
    originalMemoryUsage = process.memoryUsage;
  });

  afterEach(() => {
    (global.performance.now as unknown) = originalNow;
    process.memoryUsage = originalMemoryUsage;
  });

  it('should return operational status under normal memory conditions', async () => {
    // Mock memory usage to be at 50% (healthy)
    (process.memoryUsage as unknown) = () => {
      time += 30; // Simulate operation taking 30ms
      return {
        heapUsed: 500,
        heapTotal: 1000,
        external: 0,
        arrayBuffers: 0,
        rss: 2000
      };
    };

    mockPrisma.healthCheck.create.mockImplementation(async (data: any) => ({
      timestamp: new Date(),
      ...data.data
    }));

    const result = await checkServerHealth();

    expect(result.status).toBe('operational');
    expect(result.service).toBe('server');
    expect(result.latency).toBe(30);
    expect(result.message).toBeUndefined();
    expect(mockPrisma.healthCheck.create).toHaveBeenCalledWith({
      data: {
        service: 'server',
        status: 'operational',
        latency: 30,
        message: undefined
      }
    });
  });

  it('should return error when memory usage is high', async () => {
    // Mock memory usage to be at 95% (critical)
    (process.memoryUsage as unknown) = () => {
      time += 25; // Simulate operation taking 25ms
      return {
        heapUsed: 950,
        heapTotal: 1000,
        external: 0,
        arrayBuffers: 0,
        rss: 2000
      };
    };

    mockPrisma.healthCheck.create.mockImplementation(async (data: any) => ({
      timestamp: new Date(),
      ...data.data
    }));

    const result = await checkServerHealth();

    expect(result.status).toBe('error');
    expect(result.service).toBe('server');
    expect(result.latency).toBe(25);
    expect(result.message).toBe('High memory usage');
    expect(mockPrisma.healthCheck.create).toHaveBeenCalledWith({
      data: {
        service: 'server',
        status: 'error',
        latency: 25,
        message: 'High memory usage'
      }
    });
  });
}); 