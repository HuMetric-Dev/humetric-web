<script lang="ts">
  import type { PersonResult } from "../types";

  type Props = { result: PersonResult; index: number };
  let { result, index }: Props = $props();

  const rankStr = $derived(String(result.rank).padStart(2, "0"));

  function formatMeta(p: PersonResult): string {
    const bits: string[] = [];
    if (p.headline) bits.push(p.headline);
    if (p.location) bits.push(p.location);
    if (p.follower_count) bits.push(`${formatCount(p.follower_count)} followers`);
    return bits.join(" · ");
  }

  function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
    return String(n);
  }
</script>

<article class="card" style="animation-delay: {index * 60}ms">
  <div class="rank">{rankStr}</div>
  <div class="body">
    <header>
      <h2 class="name">{result.name || result.person_id}</h2>
      {#if result.raw_url}
        <a class="source" href={result.raw_url} target="_blank" rel="noreferrer">
          {result.source}<span aria-hidden="true">&nbsp;↗</span>
        </a>
      {:else}
        <span class="source">{result.source}</span>
      {/if}
    </header>
    {#if formatMeta(result)}
      <p class="meta">{formatMeta(result)}</p>
    {/if}
    {#if result.explanation}
      <p class="explanation">{result.explanation}</p>
    {/if}
  </div>
</article>

<style>
  .card {
    display: grid;
    grid-template-columns: var(--gutter) 1fr;
    gap: var(--s-3);
    padding: var(--s-5) 0;
    border-bottom: 1px solid var(--rule);
    opacity: 0;
    transform: translateY(8px);
    animation: reveal 320ms var(--ease-out) forwards;
  }

  .rank {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-2);
    line-height: 1.4;
    padding-top: 3px;
    letter-spacing: 0.02em;
    transition: color 160ms var(--ease-out);
  }

  .card:hover .rank {
    color: var(--accent); /* accent use #2 */
  }

  .body {
    min-width: 0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--s-3);
    margin-bottom: var(--s-1);
  }

  .name {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.3;
    color: var(--ink);
    letter-spacing: -0.005em;
  }

  .source {
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-2);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  a.source:hover {
    color: var(--ink);
  }

  .meta {
    font-size: 13px;
    color: var(--ink-2);
    line-height: 1.5;
    margin-bottom: var(--s-3);
  }

  .explanation {
    font-family: var(--font-prose);
    font-style: italic;
    font-size: 16px;
    line-height: 1.55;
    color: var(--ink);
    text-wrap: pretty;
    max-width: 56ch;
  }

  @keyframes reveal {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
