<script lang="ts">
    import { onMount } from 'svelte';

    let hasError = false;

    async function checkHealth() {
        try {
            const [serverRes, dbRes] = await Promise.all([
                fetch('/api/health/server'),
                fetch('/api/health/database')
            ]);
            
            const serverHealth = await serverRes.json();
            const dbHealth = await dbRes.json();

            hasError = serverHealth.status === 'error' || dbHealth.status === 'error';
        } catch (error) {
            console.error('Health check failed:', error);
            hasError = true;
        }
    }

    onMount(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    });
</script>

<main class="container">
    <h1>Welcome to Noteprism</h1>
    <p class="status">
        <a href="/status">
            Status: {hasError ? '⛔' : '✔️'}
        </a>
    </p>
</main>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .status {
        margin-top: 1rem;
    }

    .status a {
        color: inherit;
        text-decoration: none;
    }

    .status a:hover {
        text-decoration: underline;
    }
</style> 