<script lang="ts">
  // Selectable variant of PersonCard for the /claim picker. The card is a
  // <button>, not an <article>, so keyboard activation comes for free and
  // the whole rectangle is the hit target.
  import type { PersonResult } from "../types";

  type Props = {
    result: PersonResult;
    index: number;
    pending?: boolean;
    onpick: (personId: string) => void;
  };
  let { result, index, pending = false, onpick }: Props = $props();

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

<button
  type="button"
  class="card"
  style="animation-delay: {index * 60}ms"
  disabled={pending}
  onclick={() => onpick(result.person_id)}
  aria-label={`Claim ${result.name || result.person_id}`}
>
  <div class="rank">{rankStr}</div>
  <div class="body">
    <header>
      <span class="name">{result.name || result.person_id}</span>
      <span class="source">{result.source}</span>
    </header>
    {#if formatMeta(result)}
      <p class="meta">{formatMeta(result)}</p>
    {/if}
  </div>
  <div class="affordance" aria-hidden="true">claim →</div>
</button>

<style>
  .card {
    all: unset;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: var(--gutter) 1fr auto;
    gap: var(--s-3);
    padding: var(--s-4) var(--s-3);
    border: 1px solid var(--rule);
    background: transparent;
    cursor: pointer;
    width: 100%;
    text-align: left;
    opacity: 0;
    transform: translateY(8px);
    animation: reveal 320ms var(--ease-out) forwards;
    transition: border-color 160ms var(--ease-out), background 160ms var(--ease-out);
  }

  .card:hover:not(:disabled),
  .card:focus-visible {
    border-color: var(--ink);
    background: var(--surface);
  }

  .card:disabled {
    opacity: 0.45;
    cursor: progress;
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

  .card:hover:not(:disabled) .rank,
  .card:focus-visible .rank {
    color: var(--accent); /* accent use #2 — shared with PersonCard */
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
    font-size: 16px;
    font-weight: 700;
    line-height: 1.3;
    color: var(--ink);
    letter-spacing: -0.005em;
  }

  .source {
    font-size: 11px;
    font-weight: 500;
    color: var(--ink-2);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .meta {
    font-size: 13px;
    color: var(--ink-2);
    line-height: 1.5;
    margin: 0;
  }

  .affordance {
    align-self: center;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-2);
    text-transform: lowercase;
    letter-spacing: 0.02em;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 180ms var(--ease-out), transform 180ms var(--ease-out),
      color 180ms var(--ease-out);
  }

  .card:hover:not(:disabled) .affordance,
  .card:focus-visible .affordance {
    opacity: 1;
    transform: translateX(0);
    color: var(--ink);
  }

  @keyframes reveal {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
