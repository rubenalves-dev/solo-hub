<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { Toaster } from '$lib/components/ui/sonner';
  import { getTitle } from './context';

  const { children } = $props();
</script>

<svelte:head>
  <title>{getTitle()}</title>
  <link rel="icon" type="image/x-icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" />

{@render children?.()}
