import "server-only";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { Session } from "@/lib/types";
import { isDue } from "@/lib/auth/constants";
import {
  COOKIES,
  clearSessionCookies,
  parseSession,
  publicSession,
  refreshTokens,
  writeSession,
  writeSessionCookie,
  type StoredSession,
  type Tokens,
} from "@/lib/auth/tokens";

export function readStoredSession(): StoredSession | null {
  const store = cookies();
  if (!store.get(COOKIES.refresh)?.value) return null;
  return parseSession(store.get(COOKIES.session)?.value);
}

export function getSession(): Session | null {
  const session = readStoredSession();
  return session ? publicSession(session) : null;
}

export function getAccessToken(): string | null {
  return cookies().get(COOKIES.access)?.value || null;
}

export interface FreshToken {
  token: string | null;
  renewed?: { tokens: Tokens; session: StoredSession };
  ended?: boolean;
}

export async function renew(): Promise<FreshToken> {
  const refresh = cookies().get(COOKIES.refresh)?.value;
  const session = readStoredSession();
  if (!refresh || !session) return { token: null, ended: true };

  const result = await refreshTokens(refresh, session.user.deviceId);
  if (result.ok) return { token: result.tokens.access, renewed: { tokens: result.tokens, session: result.session } };
  return result.dead ? { token: null, ended: true } : { token: getAccessToken() };
}

export async function freshToken(): Promise<FreshToken> {
  const token = getAccessToken();
  const session = readStoredSession();
  if (!session) return { token: null };
  if (token && !isDue(session.accessExpiresAt)) return { token };
  return renew();
}

export function applySession(res: NextResponse, renewed: { tokens: Tokens; session: StoredSession }) {
  writeSession(res.cookies, renewed.tokens, renewed.session);
}

export function updateSessionUser(res: NextResponse, update: Partial<StoredSession["user"]>) {
  const session = readStoredSession();
  if (session) writeSessionCookie(res.cookies, { ...session, user: { ...session.user, ...update } });
}

export function clearSession(res: NextResponse) {
  clearSessionCookies(res.cookies);
}
