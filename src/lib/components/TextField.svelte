<script lang="ts">
  // Underlined text input that matches the Swiss-2026 vocabulary used by
  // QueryInput: no boxes, no fills — a thin rule under the field and a
  // small label above it. The caret picks up the accent token, which is
  // intentional re-use of accent #1 (already permitted by tokens.css).
  type Props = {
    label: string;
    value?: string;
    type?: "text" | "email" | "password";
    placeholder?: string;
    autocomplete?: AutoFill;
    required?: boolean;
    disabled?: boolean;
    autofocus?: boolean;
    helper?: string;
    error?: boolean;
    name?: string;
  };
  let {
    label,
    value = $bindable(""),
    type = "text",
    placeholder = "",
    autocomplete,
    required = false,
    disabled = false,
    autofocus = false,
    helper,
    error = false,
    name,
  }: Props = $props();

  let inputEl: HTMLInputElement | undefined = $state();
  let id = $props.id();

  $effect(() => {
    if (autofocus) inputEl?.focus();
  });
</script>

<div class="field" class:has-error={error}>
  <label for={id}>{label}</label>
  <!-- Native input type set dynamically; the binding still works for all three. -->
  {#if type === "password"}
    <input
      bind:this={inputEl}
      bind:value
      {id}
      {name}
      {placeholder}
      {required}
      {disabled}
      {autocomplete}
      type="password"
      spellcheck="false"
    />
  {:else if type === "email"}
    <input
      bind:this={inputEl}
      bind:value
      {id}
      {name}
      {placeholder}
      {required}
      {disabled}
      {autocomplete}
      type="email"
      spellcheck="false"
    />
  {:else}
    <input
      bind:this={inputEl}
      bind:value
      {id}
      {name}
      {placeholder}
      {required}
      {disabled}
      {autocomplete}
      type="text"
      spellcheck="false"
    />
  {/if}
  <div class="rule"></div>
  {#if helper}
    <p class="helper">{helper}</p>
  {/if}
</div>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  label {
    font-family: var(--font-sans);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink-2);
    font-weight: 500;
  }

  input {
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--ink);
    caret-color: var(--accent);
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.4;
    padding: 6px 0;
    width: 100%;
  }

  input::placeholder {
    color: var(--ink-2);
    opacity: 0.5;
  }

  input:disabled {
    opacity: 0.55;
  }

  .rule {
    height: 1px;
    background: var(--rule);
    transition: background 180ms var(--ease-out);
  }

  input:focus + .rule {
    background: var(--ink);
  }

  .has-error .rule {
    background: var(--ink);
  }

  .helper {
    font-family: var(--font-sans);
    font-size: 11px;
    color: var(--ink-2);
    margin: 4px 0 0;
    line-height: 1.4;
  }
</style>
