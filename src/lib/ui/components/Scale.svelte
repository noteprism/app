<script lang="ts">
    export let name: string;
    export let baseVar: string;
    export let showOnColors = true;
</script>

<div class="color-scale">
    <h4>{name}</h4>
    <div class="swatches">
        {#if showOnColors}
            <div class="swatch-pair">
                <div class="swatch" style="background: var(--md-sys-color-{baseVar})">
                    <span class="var-name">--md-sys-color-{baseVar}</span>
                </div>
                <div 
                    class="swatch on-color" 
                    style="background: var(--md-sys-color-on-{baseVar}); color: var(--md-sys-color-{baseVar})"
                >
                    <span class="var-name">--md-sys-color-on-{baseVar}</span>
                </div>
            </div>
        {/if}
        {#if baseVar !== 'error' && baseVar !== 'outline' && baseVar !== 'shadow' && baseVar !== 'scrim'}
            <div class="swatch-pair">
                <div class="swatch" style="background: var(--md-sys-color-{baseVar}-container)">
                    <span class="var-name">--md-sys-color-{baseVar}-container</span>
                </div>
                <div 
                    class="swatch on-color" 
                    style="background: var(--md-sys-color-on-{baseVar}-container); color: var(--md-sys-color-{baseVar}-container)"
                >
                    <span class="var-name">--md-sys-color-on-{baseVar}-container</span>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .color-scale {
        margin-bottom: 2rem;
    }

    h4 {
        margin: 0 0 1rem;
        font-size: 1.2rem;
        font-weight: 500;
    }

    .swatches {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .swatch-pair {
        display: flex;
        gap: 0.5rem;
    }

    .swatch {
        flex: 1;
        padding: 1rem;
        border-radius: 8px;
        min-height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 0.875rem;
        font-family: monospace;
    }

    .var-name {
        background: rgba(0, 0, 0, 0.1);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        backdrop-filter: blur(2px);
    }

    .on-color .var-name {
        background: rgba(255, 255, 255, 0.1);
    }
</style> 