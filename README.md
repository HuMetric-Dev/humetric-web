# humetric-web

SvelteKit SPA (adapter-static) that talks to `humetric-api` over `/api/*`.

## Design

Modern Swiss vocabulary. Two type families (Switzer + Erode Italic) plus
JetBrains Mono for tabular numerals. One sharp vermillion accent used in
exactly three places — caret, active rank, in-flight progress sweep.
See `src/lib/tokens.css` for the locked palette.

## Dev

```bash
# In one terminal — the API
cd ../humetric-api
HUMETRIC_DATA_DIR=../humetric-cli/data \
  uv run litestar --app humetric_api.app:app run --port 8000

# In another — the web (runs on Deno)
cd humetric-web
deno install --allow-scripts
deno task dev    # http://localhost:5173, /api proxied to :8000
```

## Build (static SPA)

```bash
deno task build
# Output in ./build — serve with any static host
```

## Verification

```bash
deno task check    # svelte-check (type errors)
deno task build    # vite production build
```
