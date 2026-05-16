import type { ApiErrorBody, HistoryResponse, QueryResponse } from "./types";

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(status: number, body: ApiErrorBody | string) {
    const detail =
      typeof body === "string" ? body : body.detail || body.error || "error";
    super(detail);
    this.code = typeof body === "string" ? "http_error" : body.error;
    this.status = status;
    this.name = "ApiError";
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  if (res.ok) return (await res.json()) as T;
  let body: ApiErrorBody | string;
  try {
    body = (await res.json()) as ApiErrorBody;
  } catch {
    body = await res.text();
  }
  throw new ApiError(res.status, body);
}

export async function postQuery(
  text: string,
  signal?: AbortSignal,
): Promise<QueryResponse> {
  const res = await fetch("/api/query", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });
  return unwrap<QueryResponse>(res);
}

export async function getHistory(
  limit = 20,
  signal?: AbortSignal,
): Promise<HistoryResponse> {
  const res = await fetch(`/api/history?limit=${limit}`, { signal });
  return unwrap<HistoryResponse>(res);
}
