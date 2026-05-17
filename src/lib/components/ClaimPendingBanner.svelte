<script lang="ts">
  // Renders only when the user has no linked Person. Non-blocking,
  // persistent until resolved. Background uses the existing --surface
  // token so it sits quietly under the query input.
  import { isClaimPending } from "$lib/auth.svelte";
</script>

{#if isClaimPending()}
  <div class="banner" role="status">
    <span class="text">
      your account isn't linked to a profile yet — personalization is off until you claim one.
    </span>
    <a href="/claim" class="cta">
      claim <span aria-hidden="true">→</span>
    </a>
  </div>
{/if}

<style>
  .banner {
    width: 100%;
    max-width: var(--col-max);
    margin: 0 auto var(--s-4);
    padding: var(--s-2) var(--s-3);
    background: var(--surface);
    border: 1px solid var(--rule);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--ink-2);
    line-height: 1.5;
  }

  .text {
    flex: 1;
  }

  .cta {
    flex: none;
    font-weight: 600;
    color: var(--ink);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }
</style>
