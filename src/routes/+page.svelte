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
    });
</script>

<main class="container">
    <h1>Welcome to Noteprism</h1>
    <nav>
        <ul>
            <li><a href="/ui">UI System</a></li>
            <li>
                <a href="/status" on:click={() => checkHealth()}>
                    Status: {hasError ? '⛔' : '✔️'}
                </a>
            </li>
        </ul>
    </nav>
</main>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
    }

    nav ul {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
    }

    nav li {
        margin: 0.5rem 0;
    }

    nav a {
        color: var(--md-sys-color-primary);
        text-decoration: none;
        font-size: 1.1rem;
    }

    nav a:hover {
        text-decoration: underline;
    }
</style> 