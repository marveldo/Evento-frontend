import { NextResponse, type NextRequest } from "next/server";
import { isDue } from "@/lib/auth/constants";
import { COOKIES, clearSessionCookies, parseSession, refreshTokens, writeSession, type StoredSession } from "@/lib/auth/tokens";
import {
  ONBOARDING_ROUTE,
  PREFERENCES_ROUTE,
  homeFor,
  isGuestOnly,
  isOrganizerOnly,
  isProtected,
  loginUrl,
  safeNext,
} from "@/lib/navigation";

function withPathname(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set("x-pathname", req.nextUrl.pathname + req.nextUrl.search);
  return headers;
}

function redirectToLogin(req: NextRequest) {
  const res = NextResponse.redirect(new URL(loginUrl(req.nextUrl.pathname + req.nextUrl.search), req.url));
  clearSessionCookies(res.cookies);
  return res;
}

// Where a logged-in user must go instead of this page, if anywhere: unfinished onboarding first,
// then pages only organizers can use.
function roleRedirect(pathname: string, user: StoredSession["user"]) {
  const onboarded = user.onboarded ?? true;
  const role = user.role ?? "organizer";
  if (!onboarded) return pathname === ONBOARDING_ROUTE ? null : ONBOARDING_ROUTE;
  if (pathname === ONBOARDING_ROUTE) return homeFor(role);
  if (role !== "organizer" && isOrganizerOnly(pathname)) return `${PREFERENCES_ROUTE}?upgrade=1`;
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refresh = req.cookies.get(COOKIES.refresh)?.value;
  const session = parseSession(req.cookies.get(COOKIES.session)?.value);
  const loggedIn = Boolean(refresh && session);

  if (isGuestOnly(pathname)) {
    if (!loggedIn) return NextResponse.next();
    return NextResponse.redirect(new URL(safeNext(req.nextUrl.searchParams.get("next")), req.url));
  }

  if (!loggedIn) {
    return isProtected(pathname) ? redirectToLogin(req) : NextResponse.next({ request: { headers: withPathname(req) } });
  }

  const hasAccess = Boolean(req.cookies.get(COOKIES.access)?.value);
  if (hasAccess && !isDue(session!.accessExpiresAt)) {
    const target = roleRedirect(pathname, session!.user);
    if (target) return NextResponse.redirect(new URL(target, req.url));
    return NextResponse.next({ request: { headers: withPathname(req) } });
  }

  const renewal = await refreshTokens(refresh!, session!.user.deviceId);
  if (!renewal.ok) {
    if (renewal.dead) return isProtected(pathname) ? redirectToLogin(req) : clearAndContinue(req);
    return NextResponse.next({ request: { headers: withPathname(req) } });
  }

  const target = roleRedirect(pathname, renewal.session.user);
  if (target) {
    const res = NextResponse.redirect(new URL(target, req.url));
    writeSession(res.cookies, renewal.tokens, renewal.session);
    return res;
  }

  req.cookies.set(COOKIES.access, renewal.tokens.access);
  req.cookies.set(COOKIES.refresh, renewal.tokens.refresh);
  req.cookies.set(COOKIES.session, JSON.stringify(renewal.session));
  const res = NextResponse.next({ request: { headers: withPathname(req) } });
  writeSession(res.cookies, renewal.tokens, renewal.session);
  return res;
}

function clearAndContinue(req: NextRequest) {
  req.cookies.delete([COOKIES.access, COOKIES.refresh, COOKIES.session]);
  const res = NextResponse.next({ request: { headers: withPathname(req) } });
  clearSessionCookies(res.cookies);
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
