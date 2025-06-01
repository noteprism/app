<script lang="ts">
  import { themeColors, darkThemeColors } from '$lib/theme';
  
  export let level: 1 | 2 | 3 | 4 | 5 = 1;
  export let elevation: 'none' | 'low' | 'medium' | 'high' = 'none';
  export let class_name = '';
</script>

<div 
  class="surface {class_name}"
  data-surface-level={level}
  data-elevation={elevation}
>
  <slot />
</div>

<style>
  .surface {
    background-color: var(--surface-color, var(--surface1));
    color: var(--on-surface-color, var(--on-surface));
    border-radius: var(--surface-radius, 8px);
    padding: var(--surface-padding, 1rem);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  /* Light mode */
  @media (prefers-color-scheme: light) {
    .surface[data-surface-level="1"] { --surface-color: var(--surface1); }
    .surface[data-surface-level="2"] { --surface-color: var(--surface2); }
    .surface[data-surface-level="3"] { --surface-color: var(--surface3); }
    .surface[data-surface-level="4"] { --surface-color: var(--surface4); }
    .surface[data-surface-level="5"] { --surface-color: var(--surface5); }
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .surface[data-surface-level="1"] { --surface-color: var(--dark-surface1); }
    .surface[data-surface-level="2"] { --surface-color: var(--dark-surface2); }
    .surface[data-surface-level="3"] { --surface-color: var(--dark-surface3); }
    .surface[data-surface-level="4"] { --surface-color: var(--dark-surface4); }
    .surface[data-surface-level="5"] { --surface-color: var(--dark-surface5); }
  }

  /* Elevation styles */
  .surface[data-elevation="low"] {
    box-shadow: var(--shadow-low);
  }
  .surface[data-elevation="medium"] {
    box-shadow: var(--shadow-medium);
  }
  .surface[data-elevation="high"] {
    box-shadow: var(--shadow-high);
  }
</style>