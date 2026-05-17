<script lang="ts">
  // Top-right account control: shows the current email with a small caret
  // that toggles a dropdown of account actions. Click-outside / Escape
  // closes; no accent uses introduced (the budget stays at 3).
  import { auth, isClaimPending, logout } from "$lib/auth.svelte";

  let open = $state(false);
  let rootEl: HTMLDivElement | undefined = $state();

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }

  function onDocClick(e: MouseEvent) {
    if (!open || !rootEl) return;
    if (!rootEl.contains(e.target as Node)) close();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }

  $effect(() => {
    if (open) {
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKey);
      };
    }
  });

  async function handleLogout() {
    close();
    await logout();
  }
</script>

{#if auth.user}
  <div class="root" bind:this={rootEl}>
    <button
      type="button"
      class="chip"
      aria-haspopup="menu"
      aria-expanded={open}
      onclick={toggle}
    >
      <span class="email">{auth.user.email}</span>
      <span class="caret" aria-hidden="true" class:open>▾</span>
    </button>

    {#if open}
      <div class="menu" role="menu">
        <div class="meta">
          <p class="name">{auth.user.display_name}</p>
          <p class="email-full">{auth.user.email}</p>
          {#if auth.user.person_id}
            <p class="status">linked</p>
          {:else}
            <p class="status pending">claim pending</p>
          {/if}
        </div>
        <div class="actions">
          <a class="item" href="/dashboard" onclick={close}>
            dashboard <span class="arrow">→</span>
          </a>
          {#if isClaimPending()}
            <a class="item" href="/claim" onclick={close}>
              claim a profile <span class="arrow">→</span>
            </a>
          {/if}
          <button type="button" class="item" onclick={handleLogout}>
            log out
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .root {
    position: relative;
  }

  .chip {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--ink);
    border: 1px solid transparent;
    transition: border-color 160ms var(--ease-out), background 160ms var(--ease-out);
  }

  .chip:hover,
  .chip:focus-visible,
  .chip[aria-expanded="true"] {
    border-color: var(--rule);
    background: var(--surface);
  }

  .email {
    font-weight: 500;
    letter-spacing: 0.005em;
  }

  .caret {
    color: var(--ink-2);
    font-size: 9px;
    transition: transform 160ms var(--ease-out);
  }
  .caret.open {
    transform: rotate(-180deg);
  }

  .menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 240px;
    background: var(--bg);
    border: 1px solid var(--rule);
    box-shadow: 0 8px 24px -8px rgba(10, 10, 9, 0.12);
    z-index: 20;
    animation: drop 180ms var(--ease-out);
  }

  @keyframes drop {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .meta {
    padding: var(--s-3) var(--s-3) var(--s-2);
    border-bottom: 1px solid var(--rule);
  }

  .name {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.005em;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email-full {
    margin: 2px 0 0;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    color: var(--ink-2);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status {
    margin: 8px 0 0;
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: 600;
    color: var(--ink-2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .status.pending {
    color: var(--ink);
  }

  .actions {
    display: flex;
    flex-direction: column;
  }

  .item {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--s-2) var(--s-3);
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--ink);
    cursor: pointer;
    text-decoration: none;
  }
  .item:hover,
  .item:focus-visible {
    background: var(--surface);
  }

  .arrow {
    color: var(--ink-2);
    font-size: 12px;
  }
</style>
