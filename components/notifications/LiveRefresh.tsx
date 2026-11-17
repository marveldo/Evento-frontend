"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onNotification, setUnread } from "@/lib/live-notifications";

// On the notifications page: marks everything as read, and reloads the list when a new one arrives.
export function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    setUnread(false);
    return onNotification(() => {
      setUnread(false);
      router.refresh();
    });
  }, [router]);

  return null;
}
