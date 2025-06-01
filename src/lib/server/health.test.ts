import { describe, it, expect, vi } from 'vitest';
import { measureLatency } from './health';

describe('measureLatency', () => {
  it('should measure time correctly for successful operations', async () => {
    // Mock performance.now to control timing
    const originalNow = performance.now;
    const mockNow = vi.fn();
    let time = 1000;
    mockNow.mockImplementation(() => time);
    global.performance.now = mockNow;

    // Create a mock async function that takes 100ms
    const mockAsyncFn = async () => {
      time += 100; // Simulate 100ms passing
      return 'success';
    };

    const result = await measureLatency(mockAsyncFn);

    expect(result.latency).toBe(100);
    expect(result.error).toBeUndefined();

    // Restore original performance.now
    global.performance.now = originalNow;
  });

  it('should handle errors properly', async () => {
    // Mock performance.now to control timing
    const originalNow = performance.now;
    const mockNow = vi.fn();
    let time = 1000;
    mockNow.mockImplementation(() => time);
    global.performance.now = mockNow;

    // Create a mock async function that throws after 50ms
    const mockAsyncFn = async () => {
      time += 50; // Simulate 50ms passing
      throw new Error('Test error');
    };

    const result = await measureLatency(mockAsyncFn);

    expect(result.latency).toBe(50);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('Test error');

    // Restore original performance.now
    global.performance.now = originalNow;
  });
}); 