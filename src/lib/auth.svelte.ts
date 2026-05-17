// App-wide auth state, runes-based. Components read `auth.user` directly
// (the $state proxy makes the property reactive everywhere it's referenced
// in template expressions). Mutations go through the action functions so
// the API contract stays in one place.

import { goto } from "$app/navigation";
import {
  getMe,
  postClaimPerson,
  postLogin,
  postLogout,
  postRegister,
} from "./api";
import type { WebError } from "./errors";
import { err, ok, type Result } from "./result";
import type {
  ClaimRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
  UserDTO,
} from "./types";

export const auth = $state<{ user: UserDTO | null; loading: boolean }>({
  user: null,
  loading: true,
});

export async function bootstrap(): Promise<void> {
  const r = await getMe();
  auth.user = r.kind === "ok" ? r.value : null;
  auth.loading = false;
}

export async function login(
  req: LoginRequestDTO,
): Promise<Result<UserDTO, WebError>> {
  const r = await postLogin(req);
  if (r.kind === "ok") auth.user = r.value;
  return r;
}

export async function register(
  req: RegisterRequestDTO,
): Promise<Result<RegisterResponseDTO, WebError>> {
  const r = await postRegister(req);
  if (r.kind === "ok") auth.user = r.value.user;
  return r;
}

export async function logout(): Promise<void> {
  await postLogout();
  // Clear local state regardless of network outcome — the cookie may already
  // be gone, and we don't want to strand the UI in a logged-in-looking state.
  auth.user = null;
  await goto("/login");
}

export async function claim(
  req: ClaimRequestDTO,
): Promise<Result<UserDTO, WebError>> {
  const r = await postClaimPerson(req);
  if (r.kind === "ok") auth.user = r.value;
  return r;
}

export function isAuthed(): boolean {
  return auth.user !== null;
}

export function isClaimPending(): boolean {
  return auth.user !== null && auth.user.person_id === null;
}

// Re-export for callers that want a uniform import surface.
export { err, ok };
