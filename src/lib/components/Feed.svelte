<script lang="ts">
  import type { PersonResult } from "../types";
  import PersonCard from "./PersonCard.svelte";

  type Props = { results: PersonResult[] };
  let { results }: Props = $props();
</script>

{#if results.length === 0}
  <p class="empty">no matches.</p>
{:else}
  <section class="feed" aria-label="results">
    {#each results as r, i (r.person_id)}
      <PersonCard result={r} index={i} />
    {/each}
  </section>
{/if}

<style>
  .feed {
    width: 100%;
    max-width: var(--col-max);
    margin: 0 auto;
  }

  .empty {
    width: 100%;
    max-width: var(--col-max);
    margin: var(--s-6) auto 0;
    color: var(--ink-2);
    font-size: 14px;
  }
</style>
