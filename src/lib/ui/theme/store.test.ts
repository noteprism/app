import { beforeEach, describe, expect, test, vi } from 'vitest';

// Mock window.matchMedia before importing the store
const mockMatchMedia = vi.fn();
vi.stubGlobal('window', {
    matchMedia: mockMatchMedia
});

// Now we can safely import the store
import { isDarkMode } from './store';
import { get } from 'svelte/store';

describe('theme store', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        // Reset the store to its initial state
        isDarkMode.set(false);
    });

    test('initializes with system preference', () => {
        // Setup matchMedia mock to return dark mode preference
        mockMatchMedia.mockReturnValue({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
        });

        // Re-import to trigger initialization
        vi.resetModules();
        import('./store').then(({ isDarkMode }) => {
            expect(get(isDarkMode)).toBe(true);
        });
    });

    test('can be manually updated', () => {
        // Initial state should be false from beforeEach
        expect(get(isDarkMode)).toBe(false);

        // Update to true
        isDarkMode.set(true);
        expect(get(isDarkMode)).toBe(true);

        // Update to false
        isDarkMode.set(false);
        expect(get(isDarkMode)).toBe(false);
    });

    test('handles system preference changes', () => {
        let mediaQueryCallback: ((e: { matches: boolean }) => void) | null = null;

        // Mock matchMedia with event listener support
        mockMatchMedia.mockReturnValue({
            matches: false,
            addEventListener: vi.fn((event, callback) => {
                if (event === 'change') {
                    mediaQueryCallback = callback;
                }
            }),
            removeEventListener: vi.fn()
        });

        // Re-import to set up listeners
        vi.resetModules();
        import('./store').then(({ isDarkMode }) => {
            // Simulate system preference change
            if (mediaQueryCallback) {
                mediaQueryCallback({ matches: true });
                expect(get(isDarkMode)).toBe(true);

                mediaQueryCallback({ matches: false });
                expect(get(isDarkMode)).toBe(false);
            }
        });
    });
}); 