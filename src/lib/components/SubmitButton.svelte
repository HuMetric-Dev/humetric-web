<script lang="ts">
  // Borderless text-style submit button matching the QueryInput vocabulary.
  // No fills, no shadows — just label + arrow + an under-rule that animates
  // on hover. Accent stays out of it; the hover state is pure ink.
  type Props = {
    label: string;
    pending?: boolean;
    disabled?: boolean;
    type?: "submit" | "button";
    onclick?: (e: MouseEvent) => void;
  };
  let {
    label,
    pending = false,
    disabled = false,
    type = "submit",
    onclick,
  }: Props = $props();
</script>

<button {type} disabled={disabled || pending} {onclick}>
  <span class="label">{pending ? "…" : label}</span>
  <span class="arrow" aria-hidden="true">→</span>
</button>

<style>
  button {
    appearance: none;
    background: transparent;
    border: 0;
    padding: var(--s-2) 0;
    margin: 0;
    cursor: pointer;
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.005em;
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    align-self: flex-start;
    position: relative;
  }

  button::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: var(--ink);
    transform: scaleX(0.4);
    transform-origin: left;
    transition: transform 220ms var(--ease-out);
  }

  button:hover:not(:disabled)::after,
  button:focus-visible::after {
    transform: scaleX(1);
  }

  button:disabled {
    opacity: 0.4;
    cursor: progress;
  }

  .arrow {
    display: inline-block;
    transition: transform 220ms var(--ease-out);
  }

  button:hover:not(:disabled) .arrow {
    transform: translateX(2px);
  }
</style>
