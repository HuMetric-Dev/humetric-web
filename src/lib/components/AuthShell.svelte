<script lang="ts">
  // Centered card layout shared by /login, /register, and /claim. Keeps
  // the humetric. mark at the top and reserves a single ~360px column for
  // the form. No accent uses introduced here — the budget stays at 3.
  type Props = {
    title: string;
    subtitle?: string;
    children: import("svelte").Snippet;
    footer?: import("svelte").Snippet;
  };
  let { title, subtitle, children, footer }: Props = $props();
</script>

<div class="shell">
  <header>
    <span class="mark">humetric<span class="dot">.</span></span>
  </header>

  <main>
    <h1>{title}</h1>
    {#if subtitle}
      <p class="sub">{subtitle}</p>
    {/if}

    <div class="body">
      {@render children()}
    </div>

    {#if footer}
      <div class="footer">
        {@render footer()}
      </div>
    {/if}
  </main>
</div>

<style>
  .shell {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    background: var(--bg);
  }

  header {
    width: 100%;
    padding: var(--s-5) var(--s-4) 0;
    display: flex;
    align-items: baseline;
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
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    padding: var(--s-8) var(--s-4) var(--s-8);
    display: flex;
    flex-direction: column;
  }

  h1 {
    font-family: var(--font-prose);
    font-weight: 400;
    font-size: 32px;
    line-height: 1.15;
    letter-spacing: -0.01em;
    color: var(--ink);
    margin: 0 0 var(--s-2);
  }

  .sub {
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--ink-2);
    margin: 0 0 var(--s-6);
    line-height: 1.5;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }

  .footer {
    margin-top: var(--s-6);
    padding-top: var(--s-4);
    border-top: 1px solid var(--rule);
    font-family: var(--font-sans);
    font-size: 12px;
    color: var(--ink-2);
  }
</style>
