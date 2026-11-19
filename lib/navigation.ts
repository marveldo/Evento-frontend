import type { UserRole } from "@/lib/types";

export const PROTECTED_ROUTES = ["/dashboard", "/create-event", "/settings", "/notifications", "/profile", "/orders", "/onboarding", "/payments"];
export const ORGANIZER_ROUTES = ["/dashboard", "/create-event"];
export const GUEST_ROUTES = ["/login", "/signup"];
export const DEFAULT_REDIRECT = "/home";
export const ONBOARDING_ROUTE = "/onboarding";
export const PREFERENCES_ROUTE = "/settings/preferences";

const EDIT_EVENT = /^\/events\/[^/]+\/edit\/?$/;

const matches = (routes: string[], pathname: string) => routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export function isProtected(pathname: string) {
  return matches(PROTECTED_ROUTES, pathname) || EDIT_EVENT.test(pathname);
}

export function isOrganizerOnly(pathname: string) {
  return matches(ORGANIZER_ROUTES, pathname) || EDIT_EVENT.test(pathname);
}

export function isGuestOnly(pathname: string) {
  return matches(GUEST_ROUTES, pathname);
}

export function homeFor(role: UserRole) {
  return role === "organizer" ? "/dashboard" : DEFAULT_REDIRECT;
}

export function safeNext(next: string | null | undefined) {
  return next && /^\/(?![/\\])/.test(next) ? next : DEFAULT_REDIRECT;
}

export function loginUrl(next?: string) {
  return next ? `/login?next=${encodeURIComponent(next)}` : "/login";
}

export function destinationAfterLogin(user: { role?: UserRole; onboarded?: boolean }, next: string) {
  if (user.onboarded === false) return ONBOARDING_ROUTE;
  if ((user.role ?? "organizer") !== "organizer" && isOrganizerOnly(next.split("?")[0])) return `${PREFERENCES_ROUTE}?upgrade=1`;
  return next;
}
