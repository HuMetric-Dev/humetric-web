// Rust-style Result mirroring the Python repos' humetric_core.Result.
// Narrow with the `kind` discriminator (`if (r.kind === "err") return r`) —
// it widens better than helper predicates in downstream control flow.

export type Ok<T> = { readonly kind: "ok"; readonly value: T };
export type Err<E> = { readonly kind: "err"; readonly error: E };
export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { kind: "ok", value };
}

export function err<E>(error: E): Err<E> {
  return { kind: "err", error };
}
