<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { login } from "$lib/auth.svelte";
  import AuthShell from "$lib/components/AuthShell.svelte";
  import SubmitButton from "$lib/components/SubmitButton.svelte";
  import TextField from "$lib/components/TextField.svelte";
  import { formatWebError } from "$lib/errors";

  let email = $state("");
  let password = $state("");
  let pending = $state(false);
  let errorMsg = $state<string | null>(null);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (pending) return;
    pending = true;
    errorMsg = null;
    const r = await login({ email, password });
    pending = false;
    if (r.kind === "err") {
      // The backend returns 401 with code "unauthenticated" for both unknown
      // email and wrong password — same message either way (no enumeration).
      errorMsg =
        r.error.kind === "http" && r.error.status === 401
          ? "email or password is incorrect"
          : formatWebError(r.error);
      return;
    }
    const from = $page.url.searchParams.get("from");
    await goto(from && from.startsWith("/") ? from : "/");
  }
</script>

<AuthShell title="sign in" subtitle="welcome back.">
  <form onsubmit={handleSubmit} novalidate>
    <TextField
      label="email"
      type="email"
      bind:value={email}
      autocomplete="email"
      autofocus
      required
      disabled={pending}
      error={errorMsg !== null}
    />
    <TextField
      label="password"
      type="password"
      bind:value={password}
      autocomplete="current-password"
      required
      disabled={pending}
      error={errorMsg !== null}
    />

    {#if errorMsg}
      <p class="error" role="alert" aria-live="polite">{errorMsg}</p>
    {/if}

    <div class="actions">
      <SubmitButton label="continue" {pending} />
    </div>
  </form>

  {#snippet footer()}
    no account? <a href="/register">register</a>
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
