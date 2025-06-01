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
    <nav class="navigation">
        <a href="/ui" class="nav-link">UI System</a>
        <a href="/status" class="nav-link">
            Status: {hasError ? '⛔' : '✔️'}
        </a>
    </nav>
</main>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .navigation {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .nav-link {
        color: inherit;
        text-decoration: none;
    }

    .nav-link:hover {
        text-decoration: underline;
    }
</style> 