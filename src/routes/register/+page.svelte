<script lang="ts">
  import { goto } from "$app/navigation";
  import { register } from "$lib/auth.svelte";
  import AuthShell from "$lib/components/AuthShell.svelte";
  import SubmitButton from "$lib/components/SubmitButton.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import { formatWebError } from "$lib/errors";

  let email = $state("");
  let password = $state("");
  let displayName = $state("");
  let githubUsername = $state("");
  let linkedinUrl = $state("");
  let pending = $state(false);
  let errorMsg = $state<string | null>(null);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (pending) return;
    pending = true;
    errorMsg = null;
    const r = await register({
      email,
      password,
      display_name: displayName,
      github_username: githubUsername.trim() || undefined,
      linkedin_url: linkedinUrl.trim() || undefined,
    });
    pending = false;
    if (r.kind === "err") {
      if (r.error.kind === "http" && r.error.status === 409) {
        errorMsg = "that email is already taken";
      } else if (r.error.kind === "http" && r.error.status === 400) {
        errorMsg = r.error.detail || "check your inputs";
      } else {
        errorMsg = formatWebError(r.error);
      }
      return;
    }
    if (r.value.claim_state === "linked") {
      await goto("/");
      return;
    }
    // Hand the candidate list to /claim via sessionStorage. Avoids a second
    // round-trip and gives the user something to look at immediately.
    try {
      sessionStorage.setItem(
        "humetric.claim.candidates",
        JSON.stringify(r.value.candidates),
      );
    } catch {
      // Storage disabled? Claim page falls back to its empty-state form.
    }
    await goto("/claim");
  }
</script>

<AuthShell title="create account" subtitle="one account per person; we'll try to match you to a profile.">
  <form onsubmit={handleSubmit} novalidate>
    <TextField
      label="email"
      type="email"
      bind:value={email}
      autocomplete="email"
      autofocus
      required
      disabled={pending}
    />
    <TextField
      label="password"
      type="password"
      bind:value={password}
      autocomplete="new-password"
      required
      disabled={pending}
      helper="at least 8 characters."
    />
    <TextField
      label="display name"
      bind:value={displayName}
      autocomplete="name"
      required
      disabled={pending}
    />
    <TextField
      label="github username"
      bind:value={githubUsername}
      placeholder="optional"
      disabled={pending}
      helper="if your GitHub is in the corpus, we'll auto-link your account."
    />
    <TextField
      label="linkedin url"
      bind:value={linkedinUrl}
      placeholder="optional"
      disabled={pending}
    />

    {#if errorMsg}
      <p class="error" role="alert" aria-live="polite">{errorMsg}</p>
    {/if}

    <div class="actions">
      <SubmitButton label="create account" {pending} />
    </div>
  </form>

  {#snippet footer()}
    have an account? <a href="/login">sign in</a>
  {/snippet}
</AuthShell>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  .actions {
    margin-top: var(--s-2);
  }

  .error {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--ink);
    letter-spacing: 0.01em;
  }

  a {
    color: var(--ink);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
</style>
