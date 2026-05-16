// Closed enum of web-layer error variants. Mirrors the Python repos'
// frozen-dataclass error enums in each package's errors.py. Third-party
// exceptions (fetch network failures, DOMException AbortError, JSON parse)
// are caught at call sites in api.ts and mapped into one of these.

export type HttpError = {
  readonly kind: "http";
  readonly status: number;
  readonly code: string;
  readonly detail: string;
};

export type NetworkError = {
  readonly kind: "network";
  readonly message: string;
};

export type ParseError = {
  readonly kind: "parse";
  readonly message: string;
};

export type AbortedError = {
  readonly kind: "aborted";
};

export type WebError = HttpError | NetworkError | ParseError | AbortedError;

export function httpError(
  status: number,
  code: string,
  detail: string,
): HttpError {
  return { kind: "http", status, code, detail };
}

export function networkError(message: string): NetworkError {
  return { kind: "network", message };
}

export function parseError(message: string): ParseError {
  return { kind: "parse", message };
}

export const abortedError: AbortedError = { kind: "aborted" };

// UI components are the only place that converts Err to a user-facing
// string — analogous to humetric-cli's unwrap_or_die.
export function formatWebError(e: WebError): string {
  switch (e.kind) {
    case "http":
      return e.detail || e.code || `http ${e.status}`;
    case "network":
      return e.message || "network error";
    case "parse":
      return e.message || "invalid response";
    case "aborted":
      return "request aborted";
  }
}
