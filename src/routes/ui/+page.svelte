<!-- UI Documentation Page -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import scale from '$lib/ui/components/elements/color/scale.svelte';
    import { brandColor, isDarkMode } from '$lib/ui/theme/store';

    function toggleTheme() {
        isDarkMode.update(dark => !dark);
    }
</script>

<div class="container">
    <header>
        <button class="back-button" on:click={() => goto('/')}>← Back to Home</button>
        <h1>UI System</h1>
        <p>A comprehensive design system for Noteprism, built with Material You's dynamic color system.</p>
    </header>

    <section>
        <h2>Design Tokens</h2>
        
        <h3>Colors (Material You)</h3>
        <p>Generated dynamically from our brand color (Sky: {$brandColor}) using Material Design 3:</p>
        <button class="theme-toggle" on:click={toggleTheme}>
            Toggle {$isDarkMode ? 'Light' : 'Dark'} Mode
        </button>

        <div class="color-scales">
            <div class="scale-group">
                <h4>Brand Colors</h4>
                <scale name="Primary" baseVar="primary" />
                <scale name="Secondary" baseVar="secondary" />
                <scale name="Tertiary" baseVar="tertiary" />
            </div>

            <div class="scale-group">
                <h4>Surface Colors</h4>
                <scale name="Surface" baseVar="surface" showOnColors={false} />
                <scale name="Surface Variant" baseVar="surface-variant" />
                <scale name="Background" baseVar="background" />
                <scale name="Inverse Surface" baseVar="inverse-surface" />
            </div>

            <div class="scale-group">
                <h4>Utility Colors</h4>
                <scale name="Error" baseVar="error" />
                <scale name="Outline" baseVar="outline" showOnColors={false} />
                <scale name="Shadow" baseVar="shadow" showOnColors={false} />
                <scale name="Scrim" baseVar="scrim" showOnColors={false} />
            </div>
        </div>

        <h3>Typography</h3>
        <ul>
            <li>Display (Large, Medium, Small)</li>
            <li>Headline (Large, Medium, Small)</li>
            <li>Title (Large, Medium, Small)</li>
            <li>Body (Large, Medium, Small)</li>
            <li>Label (Large, Medium, Small)</li>
        </ul>

        <h3>Spacing</h3>
        <ul>
            <li>4px (Extra Small)</li>
            <li>8px (Small)</li>
            <li>16px (Medium)</li>
            <li>24px (Large)</li>
            <li>32px (Extra Large)</li>
            <li>48px (2x Large)</li>
            <li>64px (3x Large)</li>
        </ul>

        <h3>Corner Radius</h3>
        <ul>
            <li>None (0px)</li>
            <li>Extra Small (4px)</li>
            <li>Small (8px)</li>
            <li>Medium (12px)</li>
            <li>Large (16px)</li>
            <li>Extra Large (28px)</li>
            <li>Full (9999px)</li>
        </ul>

        <h3>Elevation</h3>
        <ul>
            <li>Level 0 (none)</li>
            <li>Level 1 (low)</li>
            <li>Level 2 (medium)</li>
            <li>Level 3 (high)</li>
            <li>Level 4 (highest)</li>
        </ul>
    </section>

    <section>
        <h2>Current Components</h2>

        <h3>Layout Components</h3>
        <ul>
            <li>Header Navigation</li>
            <li>Sidebar Navigation</li>
            <li>Main Content Area</li>
            <li>Status Bar</li>
            <li>Grid Layout System</li>
        </ul>

        <h3>Data Display</h3>
        <ul>
            <li>Note Card</li>
            <li>Task Card</li>
            <li>Content Preview</li>
            <li>Tag Display</li>
            <li>Connection Map</li>
        </ul>

        <h3>Interactive Elements</h3>
        <ul>
            <li>Quick Capture Button</li>
            <li>Tag Input</li>
            <li>Priority Selector</li>
            <li>Platform Selector</li>
            <li>Content Type Toggle</li>
        </ul>
    </section>

    <section>
        <h2>Implementation Status</h2>

        <h3>✅ Completed</h3>
        <ul>
            <li>Material You color system integration</li>
            <li>Color conversion utilities</li>
            <li>Theme generation</li>
            <li>Light/dark scheme support</li>
            <li>Unit tests</li>
        </ul>

        <h3>⏳ Next Steps</h3>
        <ul>
            <li>Create basic elements</li>
            <li>Implement theme provider</li>
            <li>Build core components</li>
            <li>Add component tests</li>
        </ul>
    </section>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
    }

    header {
        margin-bottom: 2rem;
        padding: 2rem;
        background: var(--md-sys-color-surface-container-highest);
        border-radius: 16px;
    }

    .back-button {
        background: none;
        border: none;
        padding: 0.5rem 0;
        cursor: pointer;
        font-size: 1rem;
        color: var(--md-sys-color-primary);
    }

    .back-button:hover {
        text-decoration: underline;
    }

    h1 {
        margin: 1rem 0;
        font-size: 2.5rem;
        color: var(--md-sys-color-on-surface);
    }

    h2 {
        margin: 2rem 0 1rem;
        font-size: 2rem;
        border-bottom: 2px solid var(--md-sys-color-outline-variant);
        padding-bottom: 0.5rem;
        color: var(--md-sys-color-on-surface);
    }

    h3 {
        margin: 1.5rem 0 0.5rem;
        font-size: 1.5rem;
        color: var(--md-sys-color-on-surface-variant);
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0.5rem 0 1.5rem;
    }

    li {
        padding: 0.25rem 0;
        color: var(--md-sys-color-on-surface);
    }

    section {
        margin: 2rem 0;
        padding: 2rem;
        background: var(--md-sys-color-surface-container);
        border-radius: 16px;
    }

    p {
        margin: 0.5rem 0 1rem;
        line-height: 1.5;
        color: var(--md-sys-color-on-surface);
    }

    .theme-toggle {
        margin: 1rem 0;
        padding: 0.5rem 1rem;
        background: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
    }

    .theme-toggle:hover {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
    }

    .color-scales {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }

    .scale-group {
        background: var(--md-sys-color-surface-container-low);
        padding: 1.5rem;
        border-radius: 12px;
    }

    .scale-group h4 {
        margin: 0 0 1.5rem;
        font-size: 1.2rem;
        color: var(--md-sys-color-on-surface);
    }
</style> 