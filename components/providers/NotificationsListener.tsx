"use client";

import { useEffect } from "react";
import { useSession } from "@/components/providers/SessionProvider";
import { announceNotification } from "@/lib/live-notifications";
import { notifySuccess } from "@/lib/toast";
import type { Notification } from "@/lib/types";

export function NotificationsListener() {
  const { user, endSession } = useSession();
  const deviceId = user?.deviceId;

  useEffect(() => {
    if (!deviceId) return;
    const source = new EventSource("/api/notifications");

    source.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data) as Notification;
        notifySuccess(notification.detail, notification.message);
        announceNotification();
      } catch {}
    };
    source.addEventListener("logout", () => {
      source.close();
      endSession("This device was logged out.");
    });

    return () => source.close();
  }, [deviceId, endSession]);

  return null;
}
