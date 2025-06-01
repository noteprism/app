<script lang="ts">
    import { onMount } from 'svelte';
    import Surface from '$lib/components/surface.svelte';

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
    <Surface level={1} elevation="medium" class_name="welcome-card">
        <h1>Welcome to Noteprism</h1>
        <p class="status">
            <a href="/status">
                Status: {hasError ? '⛔' : '✔️'}
            </a>
        </p>
    </Surface>
</main>

<style>
    .container {
        min-height: 100vh;
        display: flex;
        align-items: flex-start;
        justify-content: center;
    }

    .status {
        margin-top: 1rem;
    }

    .status a {
        color: inherit;
        text-decoration: none;
        transition: opacity 0.2s ease;
    }

    .status a:hover {
        opacity: 0.8;
    }
</style> 