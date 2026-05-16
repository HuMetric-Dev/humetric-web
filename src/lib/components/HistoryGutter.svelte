<script lang="ts">
  import { getHistory } from "../api";
  import type { HistoryItem } from "../types";

  type Props = { onpick: (text: string) => void };
  let { onpick }: Props = $props();

  let open = $state(false);
  let items = $state<HistoryItem[]>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function load() {
    loading = true;
    error = null;
    try {
      const r = await getHistory(20);
      items = r.items;
    } catch (e) {
      error = e instanceof Error ? e.message : "history unavailable";
    } finally {
      loading = false;
    }
  }

  function handleEnter() {
    if (!open) {
      open = true;
      load();
    }
  }

  function handleLeave() {
    open = false;
  }

  function pick(text: string) {
    onpick(text);
    open = false;
  }
</script>

<aside
  class="gutter"
  class:open
  onmouseenter={handleEnter}
  onmouseleave={handleLeave}
  aria-label="query history"
>
  <div class="hairline"></div>
  <div class="panel" aria-hidden={!open}>
    <h3 class="label">history</h3>
    {#if loading && items.length === 0}
      <p class="msg">loading…</p>
    {:else if error}
      <p class="msg">{error}</p>
    {:else if items.length === 0}
      <p class="msg">no queries yet.</p>
    {:else}
      <ul>
        {#each items as it (it.ts)}
          <li>
            <button type="button" onclick={() => pick(it.free_text)}>
              {it.free_text}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</aside>

<style>
  .gutter {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 12px;
    z-index: 10;
    transition: width 220ms var(--ease-out);
    overflow: hidden;
  }

  .gutter.open {
    width: 260px;
  }

  .hairline {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--rule);
  }

  .panel {
    padding: var(--s-7) var(--s-4) var(--s-4);
    opacity: 0;
    transform: translateX(-8px);
    transition:
      opacity 220ms var(--ease-out),
      transform 220ms var(--ease-out);
    pointer-events: none;
    background: var(--bg);
    height: 100%;
    box-sizing: border-box;
  }

  .gutter.open .panel {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }

  .label {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 500;
    color: var(--ink-2);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: var(--s-3);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  li {
    border-bottom: 1px solid var(--rule);
  }

  button {
    width: 100%;
    text-align: left;
    background: none;
    border: 0;
    padding: var(--s-2) 0;
    font-size: 13px;
    line-height: 1.4;
    color: var(--ink);
    cursor: pointer;
    font-family: var(--font-sans);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button:hover {
    color: var(--ink-2);
  }

  .msg {
    font-size: 12px;
    color: var(--ink-2);
  }
</style>
