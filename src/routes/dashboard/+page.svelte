<script lang="ts">
  import AccountChip from "$lib/components/AccountChip.svelte";
  import ClaimPendingBanner from "$lib/components/ClaimPendingBanner.svelte";
  import { auth } from "$lib/auth.svelte";

  const joinedStr = $derived.by(() => {
    if (!auth.user) return "";
    const d = new Date(auth.user.created_at * 1000);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });
</script>

<header class="top">
  <a class="mark" href="/">humetric<span class="dot">.</span></a>
  <AccountChip />
</header>

<main>
  <ClaimPendingBanner />

  {#if auth.user}
    <h1 class="title">dashboard</h1>
    <p class="subtitle">your account at a glance.</p>

    <section class="block">
      <h2 class="block-label">profile</h2>
      <dl class="rows">
        <div class="row">
          <dt>name</dt>
          <dd>{auth.user.display_name}</dd>
        </div>
        <div class="row">
          <dt>email</dt>
          <dd>{auth.user.email}</dd>
        </div>
        <div class="row">
          <dt>joined</dt>
          <dd>{joinedStr}</dd>
        </div>
      </dl>
    </section>

    <section class="block">
      <h2 class="block-label">profile link</h2>
      {#if auth.user.person_id}
        <dl class="rows">
          <div class="row">
            <dt>status</dt>
            <dd>linked</dd>
          </div>
          <div class="row">
            <dt>basis</dt>
            <dd>personalization on. queries reflect your recent searches.</dd>
          </div>
        </dl>
      {:else}
        <dl class="rows">
          <div class="row">
            <dt>status</dt>
            <dd>not yet claimed</dd>
          </div>
          <div class="row">
            <dt>note</dt>
            <dd>
              your account isn't tied to a profile yet — personalization is off
              until you claim one.
            </dd>
          </div>
        </dl>
        <a class="action" href="/claim">claim a profile <span aria-hidden="true">→</span></a>
      {/if}
    </section>
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
    text-decoration: none;
  }

  .dot {
    color: var(--ink-2);
  }

  main {
    width: 100%;
    max-width: var(--col-max);
    margin: 0 auto;
    padding: var(--s-7) var(--s-4) var(--s-8);
  }

  .title {
    font-family: var(--font-prose);
    font-weight: 400;
    font-size: 32px;
    line-height: 1.15;
    color: var(--ink);
    margin: 0 0 var(--s-2);
    letter-spacing: -0.01em;
  }

  .subtitle {
    margin: 0 0 var(--s-6);
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--ink-2);
    line-height: 1.5;
  }

  .block {
    margin-bottom: var(--s-6);
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
  }

  .rows {
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .row {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: var(--s-4);
    padding: var(--s-3) 0;
    border-bottom: 1px solid var(--rule);
    align-items: baseline;
  }
  .row:last-child {
    border-bottom: none;
  }

  dt {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 500;
    color: var(--ink-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
  }

  dd {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--ink);
    line-height: 1.5;
  }

  .action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: var(--s-4);
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 500;
    color: var(--ink);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
  .action:hover {
    color: var(--ink-2);
  }
</style>
