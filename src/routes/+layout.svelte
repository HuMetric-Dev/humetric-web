<script lang="ts">
  import "../app.css";
  import { auth } from "$lib/auth.svelte";

  let { children, data } = $props();

  // Hydrate the auth store from the layout load — runs once on app boot in
  // SPA mode, and again on programmatic navigations that re-invoke load.
  // Reactive: navigating to a route that re-loads will refresh user.
  $effect(() => {
    auth.user = data.user;
    auth.loading = false;
  });
</script>

{@render children?.()}
