// SPA mode — disable SSR so adapter-static produces a single fallback shell.
import { redirect } from "@sveltejs/kit";
import { getMe } from "$lib/api";
import type { UserDTO } from "$lib/types";

export const ssr = false;
export const prerender = false;

const PUBLIC_ROUTES = new Set<string>(["/login", "/register"]);

export async function load({
  url,
}: {
  url: URL;
}): Promise<{ user: UserDTO | null }> {
  const r = await getMe();
  const user = r.kind === "ok" ? r.value : null;

  if (!user && !PUBLIC_ROUTES.has(url.pathname)) {
    const target = `/login?from=${encodeURIComponent(url.pathname + url.search)}`;
    throw redirect(302, target);
  }
  if (user && PUBLIC_ROUTES.has(url.pathname)) {
    throw redirect(302, "/");
  }

  return { user };
}
