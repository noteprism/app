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
            const [serverRes, dbRes] = await Promise.all([
                fetch('/api/health/server'),
                fetch('/api/health/database')
            ]);
            
            const serverHealth = await serverRes.json();
            const dbHealth = await dbRes.json();

            // Get all health check history
            const historyRes = await fetch('/api/health/history');
            const checks = await historyRes.json();
            // Sort checks with newest first
            healthChecks = checks.sort((a: HealthCheck, b: HealthCheck) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }

    onMount(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
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
    }

    header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .back-link {
        color: #666;
        text-decoration: none;
    }

    .back-link:hover {
        text-decoration: underline;
    }

    .last-updated {
        color: #666;
        font-size: 0.9rem;
    }

    .health-checks {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
        border-radius: 4px;
        align-items: center;
    }

    .check-item.operational {
        background: #e8f5e9;
        border: 1px solid #4caf50;
    }

    .check-item.error {
        background: #ffebee;
        border: 1px solid #f44336;
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
        color: #666;
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
        color: #666;
        font-size: 0.9rem;
    }
</style> 