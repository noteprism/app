<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { theme, isDarkMode, brandColor } from './store';

    export let initialBrandColor: string | undefined = undefined;

    onMount(() => {
        if (browser && initialBrandColor) {
            brandColor.set(initialBrandColor);
        }

        // Listen for system color scheme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => isDarkMode.set(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    });
</script>

<slot />

<style>
    :global(:root) {
        /* Default transition for theme changes */
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    :global(body) {
        background-color: var(--md-sys-color-background);
        color: var(--md-sys-color-on-background);
    }
</style> 