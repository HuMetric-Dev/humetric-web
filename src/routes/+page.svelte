<script lang="ts">
  import { postQuery } from "$lib/api";
  import { formatWebError } from "$lib/errors";
  import AccountChip from "$lib/components/AccountChip.svelte";
  import ClaimPendingBanner from "$lib/components/ClaimPendingBanner.svelte";
  import Feed from "$lib/components/Feed.svelte";
  import HistoryGutter from "$lib/components/HistoryGutter.svelte";
  import OrgCard from "$lib/components/OrgCard.svelte";
  import QueryInput from "$lib/components/QueryInput.svelte";
  import type { EntityType, OrgResult, PersonResult } from "$lib/types";

  type Scope = "people" | "companies" | "both";

  let queryText = $state("");
  let pending = $state(false);
  let error = $state<string | null>(null);
  let people = $state<PersonResult[] | null>(null);
  let orgs = $state<OrgResult[] | null>(null);
  let lastSubmitted = $state<string | null>(null);
  let scope = $state<Scope>("both");
  let inflight: AbortController | null = null;

  function scopeToEntityTypes(s: Scope): EntityType[] {
    if (s === "people") return ["person"];
    if (s === "companies") return ["organization"];
    return ["person", "organization"];
  }

  async function submit(text: string) {
    if (inflight) inflight.abort();
    inflight = new AbortController();
    pending = true;
    error = null;
    lastSubmitted = text;
    const r = await postQuery(text, scopeToEntityTypes(scope), inflight.signal);
    pending = false;
    inflight = null;
    if (r.kind === "err") {
      if (r.error.kind === "aborted") return;
      error = formatWebError(r.error);
      people = [];
      orgs = [];
      return;
    }
    people = r.value.results;
    orgs = r.value.organizations;
  }

  function pickFromHistory(text: string) {
    queryText = text;
    submit(text);
  }

  function setScope(next: Scope) {
    if (next === scope) return;
    scope = next;
    if (lastSubmitted) submit(lastSubmitted);
  }

  const totalCount = $derived(
    (people?.length ?? 0) + (orgs?.length ?? 0),
  );
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
    <div class="scope" role="tablist" aria-label="search scope">
      <button
        type="button"
        role="tab"
        aria-selected={scope === "both"}
        class:active={scope === "both"}
        onclick={() => setScope("both")}
      >both</button>
      <button
        type="button"
        role="tab"
        aria-selected={scope === "people"}
        class:active={scope === "people"}
        onclick={() => setScope("people")}
      >people</button>
      <button
        type="button"
        role="tab"
        aria-selected={scope === "companies"}
        class:active={scope === "companies"}
        onclick={() => setScope("companies")}
      >companies</button>
    </div>
  </div>

  {#if error}
    <p class="error">{error}</p>
  {:else if people !== null || orgs !== null}
    {#if (people?.length ?? 0) === 0 && (orgs?.length ?? 0) === 0}
      <p class="empty">no matches.</p>
    {:else}
      {#if people && people.length > 0}
        <section class="block" aria-label="people">
          <h2 class="block-label">people <span class="count">{people.length}</span></h2>
          <Feed results={people} />
        </section>
      {/if}
      {#if orgs && orgs.length > 0}
        <section class="block" aria-label="companies">
          <h2 class="block-label">companies <span class="count">{orgs.length}</span></h2>
          <div class="org-feed">
            {#each orgs as o, i (o.org_id)}
              <OrgCard result={o} index={i} />
            {/each}
          </div>
        </section>
      {/if}
      {#if lastSubmitted}
        <p class="footer-note">
          {totalCount} result{totalCount === 1 ? "" : "s"} for <em>{lastSubmitted}</em>
        </p>
      {/if}
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

  .scope {
    width: 100%;
    max-width: var(--col-max);
    margin: var(--s-3) auto 0;
    display: flex;
    gap: var(--s-1);
  }

  .scope button {
    background: transparent;
    border: none;
    padding: 4px 0;
    margin-right: var(--s-3);
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 500;
    color: var(--ink-2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: color 120ms var(--ease-out), border-color 120ms var(--ease-out);
  }

  .scope button:hover {
    color: var(--ink);
  }

  .scope button.active {
    color: var(--ink);
    border-bottom-color: var(--ink);
  }

  .block {
    width: 100%;
    max-width: var(--col-max);
    margin: var(--s-5) auto 0;
  }

  .block:first-of-type {
    margin-top: var(--s-5);
  }

  .block + .block {
    margin-top: var(--s-7);
  }

  .block-label {
    margin: 0 0 var(--s-3);
    padding-bottom: var(--s-2);
    border-bottom: 1px solid var(--rule);
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: flex;
    align-items: baseline;
    gap: var(--s-2);
  }

  .count {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 400;
    color: var(--ink-2);
    letter-spacing: 0;
    text-transform: none;
  }

  .org-feed {
    width: 100%;
  }

  .error {
    width: 100%;
    max-width: var(--col-max);
    margin: var(--s-5) auto 0;
    font-size: 13px;
    color: var(--ink-2);
    font-family: var(--font-sans);
  }

  .empty {
    width: 100%;
    max-width: var(--col-max);
    margin: var(--s-6) auto 0;
    color: var(--ink-2);
    font-size: 14px;
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
