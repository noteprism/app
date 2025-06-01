<script lang="ts">
  import { onMount } from 'svelte';
  import { applyThemeVariables } from '$lib/theme/store';
  import '$lib/styles/global.css';
  
  onMount(() => {
    applyThemeVariables();
  });
</script>

<slot />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background-color: var(--surface4);
    color: var(--on-surface);
  }

  :global(*) {
    box-sizing: border-box;
  }
</style> 