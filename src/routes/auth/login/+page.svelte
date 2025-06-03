<script lang="ts">
    import { enhance } from '$app/forms';
    export let form: { error?: string } | null = null;
</script>

<div class="auth-container">
    <div class="auth-card">
        <h1>Login</h1>
        
        <form method="POST" use:enhance>
            {#if form?.error}
                <div class="error">{form.error}</div>
            {/if}
            
            <div class="form-group">
                <label for="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    autocomplete="email"
                />
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    autocomplete="current-password"
                />
            </div>
            
            <button type="submit">Login</button>
        </form>
        
        <div class="auth-links">
            <a href="/auth/register">Need an account? Register</a>
        </div>
    </div>
</div>

<style>
    .auth-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        background: var(--md-sys-color-background);
    }

    .auth-card {
        background: var(--md-sys-color-surface);
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 2px 8px var(--md-sys-color-shadow);
        width: 100%;
        max-width: 400px;
    }

    h1 {
        color: var(--md-sys-color-on-surface);
        margin: 0 0 2rem;
        font-size: 2rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--md-sys-color-on-surface);
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--md-sys-color-outline);
        border-radius: 8px;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-on-surface);
    }

    input:focus {
        border-color: var(--md-sys-color-primary);
        outline: none;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 1rem;
    }

    button:hover {
        background: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
    }

    .error {
        background: var(--md-sys-color-error-container);
        color: var(--md-sys-color-on-error-container);
        padding: 0.75rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .auth-links {
        margin-top: 1.5rem;
        text-align: center;
    }

    .auth-links a {
        color: var(--md-sys-color-primary);
        text-decoration: none;
    }

    .auth-links a:hover {
        text-decoration: underline;
    }
</style> 