<!-- UI System -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import Scale from '$lib/ui/components/elements/color/scale.svelte';
    import { themeTokens, isDarkMode } from '$lib/ui/theme/store';
    import { hexToHct, hctToHex } from '$lib/ui/theme/tokens';

    // Derived hex color for the color input
    $: sourceHex = hctToHex($themeTokens.source.hue, $themeTokens.source.chroma, $themeTokens.source.tone);

    function toggleTheme() {
        isDarkMode.update(dark => !dark);
    }

    function updateThemeColor(event: Event) {
        const input = event.target as HTMLInputElement;
        const hct = hexToHct(input.value);
        themeTokens.update(tokens => ({
            ...tokens,
            source: hct
        }));
    }

    function updateHctValue(property: 'hue' | 'chroma' | 'tone', value: number) {
        themeTokens.update(tokens => ({
            ...tokens,
            source: {
                ...tokens.source,
                [property]: value
            }
        }));
    }
</script>

<div class="container">
    <header>
        <button class="back-button" on:click={() => goto('/')}>← Back</button>
        <h1>UI System</h1>
    </header>

    <section class="surface">
        <h2>Theme Controls</h2>
        <div class="theme-controls">
            <div class="control-group">
                <label>
                    Source Color
                    <input 
                        type="color" 
                        value={sourceHex}
                        on:input={updateThemeColor}
                    />
                </label>
            </div>
            <div class="control-group">
                <label>
                    Hue (0-360)
                    <input 
                        type="range" 
                        min="0" 
                        max="360" 
                        value={$themeTokens.source.hue}
                        on:input={(e) => updateHctValue('hue', parseFloat(e.currentTarget.value))}
                    />
                    <span class="value">{Math.round($themeTokens.source.hue)}</span>
                </label>
            </div>
            <div class="control-group">
                <label>
                    Chroma (0-150)
                    <input 
                        type="range" 
                        min="0" 
                        max="150" 
                        value={$themeTokens.source.chroma}
                        on:input={(e) => updateHctValue('chroma', parseFloat(e.currentTarget.value))}
                    />
                    <span class="value">{Math.round($themeTokens.source.chroma)}</span>
                </label>
            </div>
            <div class="control-group">
                <label>
                    Tone (0-100)
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={$themeTokens.source.tone}
                        on:input={(e) => updateHctValue('tone', parseFloat(e.currentTarget.value))}
                    />
                    <span class="value">{Math.round($themeTokens.source.tone)}</span>
                </label>
            </div>
            <button class="theme-toggle" on:click={toggleTheme}>
                Toggle {$isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
        </div>

        <div class="color-scales">
            <div class="scale-group">
                <h3>Brand Colors</h3>
                <Scale name="Primary" baseVar="primary" />
                <Scale name="Secondary" baseVar="secondary" />
                <Scale name="Tertiary" baseVar="tertiary" />
            </div>
        </div>
    </section>
</div>

<style>
    :global(body) {
        background: var(--md-sys-color-background);
        color: var(--md-sys-color-on-background);
        margin: 0;
        min-height: 100vh;
    }

    .container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    header {
        margin-bottom: 2rem;
    }

    h1 {
        color: var(--md-sys-color-on-surface);
        margin: 0;
    }

    h2, h3 {
        color: var(--md-sys-color-on-surface);
        margin: 0 0 1rem;
    }

    .surface {
        background: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 2px 8px var(--md-sys-color-shadow);
    }

    .back-button {
        margin-bottom: 1rem;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-primary);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }

    .back-button:hover {
        background: var(--md-sys-color-surface-container-high);
    }

    .theme-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
        background: var(--md-sys-color-surface-container);
        padding: 1.5rem;
        border-radius: 12px;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .control-group label {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--md-sys-color-on-surface);
    }

    .control-group input[type="range"] {
        flex: 1;
    }

    .control-group input[type="color"] {
        border: 2px solid var(--md-sys-color-outline);
        border-radius: 4px;
        padding: 0;
        width: 60px;
        height: 30px;
        cursor: pointer;
    }

    .value {
        min-width: 3ch;
        color: var(--md-sys-color-on-surface-variant);
        font-family: monospace;
    }

    .theme-toggle {
        background: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        margin-top: 0.5rem;
    }

    .theme-toggle:hover {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
    }

    .color-scales {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background: var(--md-sys-color-surface-container-low);
        padding: 1.5rem;
        border-radius: 12px;
    }

    .scale-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style> 