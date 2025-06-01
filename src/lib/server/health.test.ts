import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { measureLatency } from './health';

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