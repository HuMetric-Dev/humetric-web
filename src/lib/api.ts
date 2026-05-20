import {
  abortedError,
  httpError,
  networkError,
  parseError,
  type WebError,
} from "./errors";
import { err, ok, type Result } from "./result";
import type {
  ApiErrorBody,
  ClaimRequestDTO,
  EntityType,
  HistoryResponse,
  LoginRequestDTO,
  QueryResponse,
  RegisterRequestDTO,
  RegisterResponseDTO,
  UserDTO,
} from "./types";

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
  // Always include credentials so the humetric_session cookie rides on every
  // request. HttpOnly + SameSite=Lax means JS can't read it, but it travels
  // automatically with same-origin fetches once we opt in here.
  const withCreds: RequestInit = { credentials: "include", ...(init ?? {}) };
  try {
    return ok(await fetch(input, withCreds));
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      return err(abortedError);
    }
    return err(networkError(e instanceof Error ? e.message : "fetch failed"));
  }
}

export async function postQuery(
  text: string,
  entityTypes?: EntityType[],
  signal?: AbortSignal,
): Promise<Result<QueryResponse, WebError>> {
  const body: { text: string; entity_types?: EntityType[] } = { text };
  if (entityTypes && entityTypes.length > 0) body.entity_types = entityTypes;
  const res = await send("/api/query", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
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

// --- auth ---------------------------------------------------------------
// All auth endpoints set / read the humetric_session HttpOnly cookie. The
// cookie travels because `send` sets credentials: "include" by default.

export async function getMe(
  signal?: AbortSignal,
): Promise<Result<UserDTO, WebError>> {
  const res = await send("/auth/me", { signal });
  if (res.kind === "err") return res;
  return unwrap<UserDTO>(res.value);
}

export async function postRegister(
  req: RegisterRequestDTO,
  signal?: AbortSignal,
): Promise<Result<RegisterResponseDTO, WebError>> {
  const res = await send("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  if (res.kind === "err") return res;
  return unwrap<RegisterResponseDTO>(res.value);
}

export async function postLogin(
  req: LoginRequestDTO,
  signal?: AbortSignal,
): Promise<Result<UserDTO, WebError>> {
  const res = await send("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  if (res.kind === "err") return res;
  return unwrap<UserDTO>(res.value);
}

export async function postLogout(
  signal?: AbortSignal,
): Promise<Result<null, WebError>> {
  const res = await send("/auth/logout", { method: "POST", signal });
  if (res.kind === "err") return res;
  // 204 No Content — no body to parse.
  if (res.value.status === 204) return ok(null);
  return unwrap<null>(res.value);
}

export async function postClaimPerson(
  req: ClaimRequestDTO,
  signal?: AbortSignal,
): Promise<Result<UserDTO, WebError>> {
  const res = await send("/auth/claim-person", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  if (res.kind === "err") return res;
  return unwrap<UserDTO>(res.value);
}
