import {
  abortedError,
  httpError,
  networkError,
  parseError,
  type WebError,
} from "./errors";
import { err, ok, type Result } from "./result";
import type { ApiErrorBody, HistoryResponse, QueryResponse } from "./types";

async function unwrap<T>(res: Response): Promise<Result<T, WebError>> {
  if (res.ok) {
    try {
      return ok((await res.json()) as T);
    } catch (e) {
      return err(
        parseError(e instanceof Error ? e.message : "json parse failed"),
      );
    }
  }
  let body: ApiErrorBody | string;
  try {
    body = (await res.json()) as ApiErrorBody;
  } catch {
    try {
      body = await res.text();
    } catch {
      body = "";
    }
  }
  if (typeof body === "string") {
    return err(httpError(res.status, "http_error", body || `http ${res.status}`));
  }
  return err(httpError(res.status, body.error, body.detail || body.error));
}

async function send(
  input: string,
  init: RequestInit | undefined,
): Promise<Result<Response, WebError>> {
  try {
    return ok(await fetch(input, init));
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return err(abortedError);
    }
    return err(networkError(e instanceof Error ? e.message : "fetch failed"));
  }
}

export async function postQuery(
  text: string,
  signal?: AbortSignal,
): Promise<Result<QueryResponse, WebError>> {
  const res = await send("/api/query", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });
  if (res.kind === "err") return res;
  return unwrap<QueryResponse>(res.value);
}

export async function getHistory(
  limit = 20,
  signal?: AbortSignal,
): Promise<Result<HistoryResponse, WebError>> {
  const res = await send(`/api/history?limit=${limit}`, { signal });
  if (res.kind === "err") return res;
  return unwrap<HistoryResponse>(res.value);
}
