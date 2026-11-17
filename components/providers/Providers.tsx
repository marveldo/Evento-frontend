"use client";

import { Toaster } from "@/components/ui/toaster";
import { NotificationsListener } from "@/components/providers/NotificationsListener";
import { SessionProvider } from "@/components/providers/SessionProvider";
import type { Session } from "@/lib/types";

export function Providers({ session, children }: { session: Session | null; children: React.ReactNode }) {
  return (
    <SessionProvider initialSession={session}>
      {children}
      <NotificationsListener />
      <Toaster />
    </SessionProvider>
  );
}
