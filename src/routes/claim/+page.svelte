<script lang="ts">
  import { goto } from "$app/navigation";
  import { auth, claim } from "$lib/auth.svelte";
  import AuthShell from "$lib/components/AuthShell.svelte";
  import PersonClaimCard from "$lib/components/PersonClaimCard.svelte";
  import SubmitButton from "$lib/components/SubmitButton.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import { formatWebError } from "$lib/errors";
  import type { PersonResult } from "$lib/types";

  // Candidates were stashed by /register; if missing (direct navigation or
  // cleared storage), we degrade to the create-new flow.
  let candidates = $state<PersonResult[]>([]);
  let pending = $state(false);
  let errorMsg = $state<string | null>(null);
  let showCreate = $state(false);
  let newName = $state("");
  let newHeadline = $state("");

  $effect(() => {
    try {
      const raw = sessionStorage.getItem("humetric.claim.candidates");
      if (raw) candidates = JSON.parse(raw) as PersonResult[];
    } catch {
      candidates = [];
    }
  });

  async function pickCandidate(personId: string) {
    if (pending) return;
    pending = true;
    errorMsg = null;
    const r = await claim({ person_id: personId });
    pending = false;
    if (r.kind === "err") {
      errorMsg =
        r.error.kind === "http" && r.error.status === 409
          ? "that profile was just claimed by another account — pick another."
          : formatWebError(r.error);
      return;
    }
    sessionStorage.removeItem("humetric.claim.candidates");
    await goto("/");
  }

  async function createNew(e: Event) {
    e.preventDefault();
    if (pending || !newName.trim()) return;
    pending = true;
    errorMsg = null;
    const r = await claim({
      create_new: true,
      new_person_name: newName.trim(),
      new_person_headline: newHeadline.trim() || undefined,
    });
    pending = false;
    if (r.kind === "err") {
      errorMsg = formatWebError(r.error);
      return;
    }
    sessionStorage.removeItem("humetric.claim.candidates");
    await goto("/");
  }

  function skip() {
    goto("/");
  }
</script>

<AuthShell
  title="is this you?"
  subtitle={candidates.length > 0
    ? "we found profiles that might match. pick one — or create a fresh one."
    : "we couldn't find a matching profile. create one to start using personalization."}
>
  {#if auth.user?.email}
    <p class="email-row">signed in as <span>{auth.user.email}</span></p>
  {/if}

  {#if candidates.length > 0}
    <div class="cards">
      {#each candidates as c, i (c.person_id)}
        <PersonClaimCard result={c} index={i} {pending} onpick={pickCandidate} />
      {/each}
    </div>
  {/if}

  {#if errorMsg}
    <p class="error" role="alert" aria-live="polite">{errorMsg}</p>
  {/if}

  {#if !showCreate}
    <button class="link-row" type="button" onclick={() => (showCreate = true)}>
      {candidates.length > 0 ? "none of these are me" : "create a fresh profile"} →
    </button>
  {:else}
    <form class="create" onsubmit={createNew} novalidate>
      <TextField
        label="name"
        bind:value={newName}
        required
        autofocus
        disabled={pending}
      />
      <TextField
        label="headline"
        bind:value={newHeadline}
        placeholder="optional"
        disabled={pending}
        helper="one-line summary of what you do."
      />
      <div class="actions">
        <SubmitButton label="create profile" {pending} disabled={!newName.trim()} />
        <button
          type="button"
          class="ghost"
          onclick={() => (showCreate = false)}
          disabled={pending}
        >
          cancel
        </button>
      </div>
    </form>
  {/if}

  {#snippet footer()}
    <button class="skip" type="button" onclick={skip}>skip for now</button>
    <span class="footer-hint">
      &nbsp;· you can claim a profile later from your account menu.
    </span>
  {/snippet}
</AuthShell>

<style>
  .email-row {
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--ink-2);
    margin: 0;
    letter-spacing: 0.01em;
  }
  .email-row span {
    color: var(--ink);
    font-weight: 500;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
  }

  .error {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--ink);
  }

  .link-row {
    all: unset;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--ink);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
    align-self: flex-start;
    padding: var(--s-1) 0;
  }
  .link-row:hover {
    color: var(--ink-2);
  }

  .create {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
    padding: var(--s-4);
    background: var(--surface);
    border: 1px solid var(--rule);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--s-4);
  }

  .ghost {
    all: unset;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--ink-2);
  }
  .ghost:hover {
    color: var(--ink);
  }
  .ghost:disabled {
    opacity: 0.4;
    cursor: progress;
  }

  .skip {
    all: unset;
    cursor: pointer;
    color: var(--ink);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
  .footer-hint {
    color: var(--ink-2);
  }
</style>
