<!-- UI Documentation Page -->
<script lang="ts">
    import { goto } from '$app/navigation';
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
        <p>Generated dynamically from a source color using our Material Design 3 integration:</p>
        <ul>
            <li>Primary Color</li>
            <li>Secondary Color</li>
            <li>Tertiary Color</li>
            <li>Error Color</li>
            <li>Neutral Color</li>
            <li>Neutral Variant Color</li>
            <li>Surface Colors</li>
            <li>Background Colors</li>
        </ul>

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
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    header {
        margin-bottom: 2rem;
    }

    .back-button {
        background: none;
        border: none;
        padding: 0.5rem 0;
        cursor: pointer;
        font-size: 1rem;
        color: var(--color-primary);
    }

    .back-button:hover {
        text-decoration: underline;
    }

    h1 {
        margin: 1rem 0;
        font-size: 2.5rem;
    }

    h2 {
        margin: 2rem 0 1rem;
        font-size: 2rem;
        border-bottom: 2px solid var(--color-border);
        padding-bottom: 0.5rem;
    }

    h3 {
        margin: 1.5rem 0 0.5rem;
        font-size: 1.5rem;
        color: var(--color-text-secondary);
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0.5rem 0 1.5rem;
    }

    li {
        padding: 0.25rem 0;
    }

    section {
        margin: 2rem 0;
    }

    p {
        margin: 0.5rem 0 1rem;
        line-height: 1.5;
    }
</style> 