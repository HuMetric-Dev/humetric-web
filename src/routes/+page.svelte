<script lang="ts">
  import { postQuery } from "$lib/api";
  import { formatWebError } from "$lib/errors";
  import AccountChip from "$lib/components/AccountChip.svelte";
  import ClaimPendingBanner from "$lib/components/ClaimPendingBanner.svelte";
  import Feed from "$lib/components/Feed.svelte";
  import HistoryGutter from "$lib/components/HistoryGutter.svelte";
  import QueryInput from "$lib/components/QueryInput.svelte";
  import type { PersonResult } from "$lib/types";

  let queryText = $state("");
  let pending = $state(false);
  let error = $state<string | null>(null);
  let results = $state<PersonResult[] | null>(null);
  let lastSubmitted = $state<string | null>(null);
  let inflight: AbortController | null = null;

  async function submit(text: string) {
    if (inflight) inflight.abort();
    inflight = new AbortController();
    pending = true;
    error = null;
    lastSubmitted = text;
    const r = await postQuery(text, inflight.signal);
    pending = false;
    inflight = null;
    if (r.kind === "err") {
      if (r.error.kind === "aborted") return;
      error = formatWebError(r.error);
      results = [];
      return;
    }
    results = r.value.results;
  }

  function pickFromHistory(text: string) {
    queryText = text;
    submit(text);
  }
</script>

<HistoryGutter onpick={pickFromHistory} />

<header class="top">
  <span class="mark">humetric<span class="dot">.</span></span>
  <AccountChip />
</header>

<main>
  <ClaimPendingBanner />
  <div class="input-wrap">
    <QueryInput bind:value={queryText} {pending} onsubmit={submit} />
  </div>

  {#if error}
    <p class="error">{error}</p>
  {:else if results !== null}
    <div class="results">
      <Feed results={results} />
    </div>
    {#if lastSubmitted && results.length > 0}
      <p class="footer-note">
        {results.length} results for <em>{lastSubmitted}</em>
      </p>
    {/if}
  {/if}
</main>

<style>
  .top {
    width: 100%;
    max-width: var(--col-max);
    margin: 0 auto;
    padding: var(--s-5) var(--s-4) 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-4);
  }

  .mark {
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--ink);
  }

  .dot {
    color: var(--ink-2);
  }

  main {
    padding: var(--s-7) var(--s-4) var(--s-8);
  }

  .input-wrap {
    padding-bottom: var(--s-6);
  }

  .results {
    margin-top: var(--s-5);
  }

  .error {
    width: 100%;
    max-width: var(--col-max);
    margin: var(--s-5) auto 0;
    font-size: 13px;
    color: var(--ink-2);
    font-family: var(--font-sans);
  }

  .footer-note {
    width: 100%;
    max-width: var(--col-max);
    margin: var(--s-6) auto 0;
    font-size: 12px;
    color: var(--ink-2);
    letter-spacing: 0.02em;
  }

  em {
    font-family: var(--font-prose);
    font-style: italic;
    font-weight: 400;
    color: var(--ink);
  }
</style>
