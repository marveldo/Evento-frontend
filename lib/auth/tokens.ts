import type { NextResponse } from "next/server";
import type { Session, SessionUser, User } from "@/lib/types";

type ResponseCookies = NextResponse["cookies"];

export const BACKEND_URL = (process.env.BACKEND_URL ?? "").replace(/\/$/, "");

export const COOKIES = {
  access: "evento_access",
  refresh: "evento_refresh",
  session: "evento_session",
} as const;

export interface AuthPayload {
  access: string;
  refresh: string;
  // When each token expires, as an ISO 8601 UTC timestamp, e.g. "2026-12-17T10:30:00Z" (evento-api).
  access_expiry?: string;
  refresh_expiry?: string;
  // Older shape: lifetime in seconds. Used only if the timestamps above are missing.
  access_expires_in?: number;
  refresh_expires_in?: number;
  data: User;
}

export interface StoredSession extends Session {
  refreshExpiresAt: number;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export type Renewal =
  | { ok: true; tokens: Tokens; session: StoredSession }
  | { ok: false; dead: boolean };

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function toSessionUser(user: User, deviceId?: string): SessionUser {
  return {
    id: user.id,
    name: user.full_name ?? "",
    email: user.email,
    image: user.profile_img,
    deviceId: deviceId ?? user.device_id ?? "",
    role: user.role ?? "organizer",
    onboarded: user.onboarded ?? true,
  };
}

// Reads the `exp` claim (seconds since epoch) from a JWT. This only decodes the payload; it doesn't
// verify the signature, which is fine because the value is used only to schedule a refresh.
function jwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload)) as { exp?: unknown };
    return typeof exp === "number" && Number.isFinite(exp) ? exp * 1000 : null;
  } catch {
    return null;
  }
}

// Works out when a token expires, in ms since epoch. Tries, in order: the backend's ISO timestamp,
// the older seconds-from-now field, the token's own `exp` claim, and finally a short fallback.
function expiryOf(
  token: string,
  expiry: string | undefined,
  expiresIn: number | undefined,
  fallbackMs: number,
  now: number,
) {
  const at = expiry ? Date.parse(expiry) : NaN;
  if (Number.isFinite(at)) return at;
  if (typeof expiresIn === "number" && Number.isFinite(expiresIn)) return now + expiresIn * 1000;
  return jwtExpiry(token) ?? now + fallbackMs;
}

export function sessionFromPayload(payload: AuthPayload): StoredSession {
  const now = Date.now();
  return {
    user: toSessionUser(payload.data),
    accessExpiresAt: expiryOf(payload.access, payload.access_expiry, payload.access_expires_in, 5 * 60_000, now),
    refreshExpiresAt: expiryOf(payload.refresh, payload.refresh_expiry, payload.refresh_expires_in, 24 * 60 * 60_000, now),
  };
}

export function parseSession(value: string | undefined): StoredSession | null {
  if (!value) return null;
  try {
    const session = JSON.parse(value) as StoredSession;
    return session?.user?.id ? session : null;
  } catch {
    return null;
  }
}

function secondsUntil(timestamp: number) {
  return Math.max(0, Math.floor((timestamp - Date.now()) / 1000));
}

export function writeSessionCookie(cookies: ResponseCookies, session: StoredSession) {
  cookies.set(COOKIES.session, JSON.stringify(session), { ...cookieOptions, maxAge: secondsUntil(session.refreshExpiresAt) });
}

export function writeSession(cookies: ResponseCookies, tokens: Tokens, session: StoredSession) {
  cookies.set(COOKIES.access, tokens.access, { ...cookieOptions, maxAge: secondsUntil(session.accessExpiresAt) });
  cookies.set(COOKIES.refresh, tokens.refresh, { ...cookieOptions, maxAge: secondsUntil(session.refreshExpiresAt) });
  writeSessionCookie(cookies, session);
}

export function clearSessionCookies(cookies: ResponseCookies) {
  for (const name of Object.values(COOKIES)) cookies.set(name, "", { ...cookieOptions, maxAge: 0 });
}

export function publicSession(session: StoredSession): Session {
  return { user: session.user, accessExpiresAt: session.accessExpiresAt };
}

const inflight = new Map<string, Promise<Renewal>>();

export function refreshTokens(refresh: string, deviceId: string): Promise<Renewal> {
  let job = inflight.get(refresh);
  if (job) return job;

  job = (async (): Promise<Renewal> => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh, device_id: deviceId }),
        cache: "no-store",
      });
      const body = (await res.json().catch(() => null)) as AuthPayload | null;
      if (res.ok && body?.access && body.refresh) {
        return { ok: true, tokens: { access: body.access, refresh: body.refresh }, session: sessionFromPayload(body) };
      }
      return { ok: false, dead: res.status === 401 || res.status === 422 };
    } catch {
      return { ok: false, dead: false };
    }
  })();

  inflight.set(refresh, job);
  job.finally(() => setTimeout(() => inflight.delete(refresh), 15_000));
  return job;
}
