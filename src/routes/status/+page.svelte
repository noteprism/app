<script lang="ts">
    import { onMount } from 'svelte';

    interface HealthCheck {
        service: string;
        status: string;
        latency: number;
        timestamp: Date;
        message?: string;
    }

    let healthChecks: HealthCheck[] = [];

    async function checkHealth() {
        try {
            const historyRes = await fetch('/api/health/history');
            const checks = await historyRes.json();
            healthChecks = checks;
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }

    onMount(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    });

    function formatDate(date: Date): string {
        return new Date(date).toLocaleString();
    }

    function getServiceType(service: string): string {
        return service.toLowerCase().includes('database') ? 'Database Check' : 'Server Check';
    }
</script>

<main class="container">
    <header>
        <a href="/" class="back-link">← Back to Home</a>
        <h1>Noteprism Status</h1>
        <div class="last-updated">
            Last updated {new Date().toLocaleString()} | Next update in 30 sec
        </div>
    </header>

    <section class="health-checks">
        <h2>Health Check History</h2>
        <div class="check-list">
            {#each healthChecks as check}
                <div class="check-item {check.status}">
                    <div class="check-time">{formatDate(check.timestamp)}</div>
                    <div class="check-service">
                        {check.service}
                        <span class="service-type">({getServiceType(check.service)})</span>
                    </div>
                    <div class="check-status">{check.status}</div>
                    <div class="check-latency">{check.latency.toFixed(2)}ms</div>
                    {#if check.message}
                        <div class="check-message">{check.message}</div>
                    {/if}
                </div>
            {/each}
        </div>
    </section>
</main>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        color: var(--md-sys-color-on-background);
    }

    header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    h1 {
        color: var(--md-sys-color-on-surface);
        margin: 0;
    }

    h2 {
        color: var(--md-sys-color-on-surface);
        margin: 0 0 1rem;
    }

    .back-link {
        color: var(--md-sys-color-primary);
        text-decoration: none;
    }

    .back-link:hover {
        text-decoration: underline;
        opacity: 0.9;
    }

    .last-updated {
        color: var(--md-sys-color-on-surface-variant);
        font-size: 0.9rem;
    }

    .health-checks {
        background: var(--md-sys-color-surface);
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: 0 2px 8px var(--md-sys-color-shadow);
    }

    .check-list {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .check-item {
        display: grid;
        grid-template-columns: auto 1fr 100px 100px;
        gap: 1rem;
        padding: 0.75rem;
        border-radius: 8px;
        align-items: center;
    }

    .check-item.operational {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
        border: 1px solid var(--md-sys-color-primary);
    }

    .check-item.error {
        background: var(--md-sys-color-error-container);
        color: var(--md-sys-color-on-error-container);
        border: 1px solid var(--md-sys-color-error);
    }

    .check-time {
        font-family: monospace;
    }

    .check-service {
        font-weight: bold;
    }

    .service-type {
        font-weight: normal;
        font-size: 0.9rem;
        color: var(--md-sys-color-on-surface-variant);
    }

    .check-status {
        text-transform: uppercase;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .check-latency {
        font-family: monospace;
    }

    .check-message {
        grid-column: 1 / -1;
        color: var(--md-sys-color-on-surface-variant);
        font-size: 0.9rem;
    }
</style> 