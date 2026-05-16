<script lang="ts">
  type Props = {
    value?: string;
    pending?: boolean;
    onsubmit: (text: string) => void;
  };
  let { value = $bindable(""), pending = false, onsubmit }: Props = $props();

  let inputEl: HTMLTextAreaElement | undefined = $state();

  function handleKey(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = value.trim();
      if (text && !pending) onsubmit(text);
    }
  }

  export function focus() {
    inputEl?.focus();
  }
</script>

<div class="wrap">
  <textarea
    bind:this={inputEl}
    bind:value
    onkeydown={handleKey}
    placeholder="describe the person you're looking for"
    rows="1"
    spellcheck="false"
    autocomplete="off"
    disabled={pending}
    aria-label="query"
  ></textarea>
  <div class="rule" class:pending></div>
</div>

<style>
  .wrap {
    width: 100%;
    max-width: var(--col-max);
    margin: 0 auto;
    position: relative;
  }

  textarea {
    display: block;
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--ink);
    caret-color: var(--accent); /* accent use #1 */
    font-family: var(--font-sans);
    font-size: 22px;
    line-height: 1.4;
    font-weight: 400;
    padding: var(--s-3) 0;
    resize: none;
    overflow: hidden;
  }

  textarea::placeholder {
    color: var(--ink-2);
    font-style: normal;
  }

  textarea:disabled {
    opacity: 0.55;
    cursor: progress;
  }

  .rule {
    height: 1px;
    width: 100%;
    background: var(--rule);
    position: relative;
    overflow: hidden;
  }

  .rule.pending::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--accent); /* accent use #3 */
    transform-origin: left;
    animation: sweep 1.4s var(--ease-out) infinite;
  }

  @keyframes sweep {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
