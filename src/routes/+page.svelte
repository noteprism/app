<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

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
    <header>
        <h1>Welcome to Noteprism</h1>
        {#if $page.data.user}
            <div class="user-status">
                Logged in as {$page.data.user.email}
                <form action="/auth/logout" method="POST">
                    <button type="submit" class="logout-btn">Logout</button>
                </form>
            </div>
        {:else}
            <div class="auth-links">
                <a href="/auth/login" class="auth-btn login">Login</a>
                <a href="/auth/register" class="auth-btn register">Register</a>
            </div>
        {/if}
    </header>

    <nav>
        <ul>
            <li><a href="/ui">UI System</a></li>
            <li>
                <a href="/status">
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

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .user-status {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--md-sys-color-on-surface-variant);
    }

    .auth-links {
        display: flex;
        gap: 1rem;
    }

    .auth-btn {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .auth-btn.login {
        background: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
    }

    .auth-btn.register {
        background: var(--md-sys-color-secondary);
        color: var(--md-sys-color-on-secondary);
    }

    .auth-btn:hover {
        opacity: 0.9;
    }

    .logout-btn {
        background: var(--md-sys-color-error);
        color: var(--md-sys-color-on-error);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }

    .logout-btn:hover {
        opacity: 0.9;
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