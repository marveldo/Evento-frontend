"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
// Next's own router here, not nextjs-toploader's: that one is a new object on every render, which
// would make endSession unstable and reconnect the notifications stream on every navigation.
import { usePathname, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { isDue, REFRESH_EARLY_MS } from "@/lib/auth/constants";
import { loginUrl } from "@/lib/navigation";
import { notifyError } from "@/lib/toast";
import type { Session, SessionUser } from "@/lib/types";

const MAX_TIMER_MS = 2_147_483_647;
const RETRY_MS = 15_000;

interface SessionState {
  user: SessionUser | null;
  signIn: (session: Session) => void;
  updateUser: (update: Partial<SessionUser>) => void;
  logout: () => Promise<void>;
  endSession: (reason: string) => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ initialSession, children }: { initialSession: Session | null; children: React.ReactNode }) {
  const [session, setSession] = useState(initialSession);
  const [tick, setTick] = useState(0);
  // Time of the last refresh attempt. Refreshes are spaced at least RETRY_MS apart, so a
  // refresh that comes back still due (or fails) can't retrigger itself in a tight loop.
  const lastAttempt = useRef(0);
  const router = useRouter();
  const pathname = usePathname();
  // Read through a ref so endSession doesn't change on every navigation.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => setSession(initialSession), [initialSession]);

  const endSession = useCallback(
    (reason: string) => {
      setSession(null);
      notifyError("You've been logged out", reason);
      router.push(loginUrl(pathnameRef.current));
      router.refresh();
    },
    [router],
  );

  const refresh = useCallback(async () => {
    lastAttempt.current = Date.now();
    try {
      setSession(await api.refresh());
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) endSession("Your session has ended. Log in again.");
      else setTick((t) => t + 1);
    }
  }, [endSession]);

  useEffect(() => {
    if (!session) return;
    const now = Date.now();
    const due = session.accessExpiresAt - REFRESH_EARLY_MS - now;
    const cooldown = lastAttempt.current + RETRY_MS - now;
    const timer = setTimeout(() => {
      if (isDue(session.accessExpiresAt)) refresh();
      else setTick((t) => t + 1);
    }, Math.min(Math.max(due, cooldown, 0), MAX_TIMER_MS));
    return () => clearTimeout(timer);
  }, [session, tick, refresh]);

  useEffect(() => {
    if (!session) return;
    const onVisible = () => {
      if (document.visibilityState !== "visible" || !isDue(session.accessExpiresAt)) return;
      if (Date.now() - lastAttempt.current >= RETRY_MS) refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [session, refresh]);

  const signIn = useCallback((next: Session) => setSession(next), []);

  const updateUser = useCallback((update: Partial<SessionUser>) => {
    setSession((current) => (current ? { ...current, user: { ...current.user, ...update } } : current));
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => null);
    setSession(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ user: session?.user ?? null, signIn, updateUser, logout, endSession }),
    [session, signIn, updateUser, logout, endSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside <SessionProvider>");
  return context;
}
