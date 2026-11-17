"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/components/providers/SessionProvider";
import { ApiError, api } from "@/lib/api/client";
import { announceNotification } from "@/lib/live-notifications";
import { notifySuccess } from "@/lib/toast";
import type { Notification } from "@/lib/types";

type SocketMessage = Notification & { type?: "logout" };

const WS_URL = (process.env.NEXT_PUBLIC_WS_URL ?? "").replace(/\/$/, "");
const LOGGED_OUT = 4401;
const MIN_RETRY_MS = 1_000;
const MAX_RETRY_MS = 30_000;

export function NotificationsListener() {
  const { user, endSession } = useSession();
  const deviceId = user?.deviceId;
  const endSessionRef = useRef(endSession);
  endSessionRef.current = endSession;

  useEffect(() => {
    if (!deviceId || !WS_URL) return;

    let socket: WebSocket | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let delay = MIN_RETRY_MS;
    let stopped = false;
    let connecting = false;

    const stop = (reason: string) => {
      stopped = true;
      endSessionRef.current(reason);
    };

    const scheduleReconnect = () => {
      if (stopped) return;
      clearTimeout(timer);
      timer = setTimeout(connect, delay);
      delay = Math.min(delay * 2, MAX_RETRY_MS);
    };

    async function connect() {
      if (stopped || socket || connecting) return;
      connecting = true;
      let token: string;
      try {
        token = (await api.socketToken()).token;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return stop("Your session has ended. Log in again.");
        return scheduleReconnect();
      } finally {
        connecting = false;
      }
      if (stopped) return;

      const ws = new WebSocket(`${WS_URL}/ws/notifications/?token=${encodeURIComponent(token)}`);
      socket = ws;
      ws.onopen = () => {
        delay = MIN_RETRY_MS;
      };
      ws.onmessage = (event) => {
        let data: SocketMessage;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        if (data.type === "logout") {
          ws.onclose = null;
          socket = null;
          ws.close();
          return stop("This device was logged out.");
        }
        notifySuccess(data.detail, data.message);
        announceNotification();
      };
      ws.onclose = (event) => {
        socket = null;
        if (event.code === LOGGED_OUT) return stop("This device was logged out.");
        scheduleReconnect();
      };
    }

    const reconnectNow = () => {
      if (socket || connecting || stopped) return;
      delay = MIN_RETRY_MS;
      clearTimeout(timer);
      connect();
    };

    connect();
    window.addEventListener("online", reconnectNow);

    return () => {
      stopped = true;
      clearTimeout(timer);
      window.removeEventListener("online", reconnectNow);
      if (socket) {
        socket.onclose = null;
        socket.close();
      }
    };
  }, [deviceId]);

  return null;
}
