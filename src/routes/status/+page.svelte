<script lang="ts">
    import { onMount } from 'svelte';
    import Surface from '$lib/components/surface.svelte';

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
    <Surface level={1} elevation="medium">
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
                    <Surface 
                        level={2} 
                        elevation="low" 
                        class_name="check-item {check.status}"
                    >
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
                    </Surface>
                {/each}
            </div>
        </section>
    </Surface>
</main>

<style>
    header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .back-link {
        color: var(--on-surface-variant);
        text-decoration: none;
        transition: opacity 0.2s ease;
    }

    .back-link:hover {
        opacity: 0.8;
    }

    .last-updated {
        color: var(--on-surface-variant);
        font-size: 0.9rem;
    }

    .health-checks {
        margin-top: 1.5rem;
    }

    .check-list {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
        color: var(--on-surface-variant);
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
        color: var(--on-surface-variant);
        font-size: 0.9rem;
    }
</style> 