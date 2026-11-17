export const PROTECTED_ROUTES = ["/home", "/dashboard", "/create-event", "/events", "/settings", "/notifications", "/search", "/profile"];
export const GUEST_ROUTES = ["/login", "/signup"];
export const DEFAULT_REDIRECT = "/home";

export function isProtected(pathname: string) {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isGuestOnly(pathname: string) {
  return GUEST_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function safeNext(next: string | null | undefined) {
  return next && /^\/(?![/\\])/.test(next) ? next : DEFAULT_REDIRECT;
}

export function loginUrl(next?: string) {
  return next ? `/login?next=${encodeURIComponent(next)}` : "/login";
}
