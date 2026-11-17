"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon } from "@radix-ui/react-icons";
import { hasUnread, onNotification, setUnread } from "@/lib/live-notifications";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const pathname = usePathname();
  const onPage = pathname === "/notifications";
  const [unread, setUnreadState] = useState(false);

  useEffect(() => {
    setUnreadState(hasUnread());
    return onNotification(() => setUnreadState(hasUnread()));
  }, []);

  useEffect(() => {
    if (!onPage) return;
    setUnread(false);
    setUnreadState(false);
  }, [onPage]);

  return (
    <Link
      href="/notifications"
      aria-label={unread ? "Notifications (unread)" : "Notifications"}
      className={cn("relative rounded-full p-1 transition-colors hover:text-brand", onPage && "text-brand")}
    >
      <BellIcon className="size-5" />
      {unread && <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-brand ring-2 ring-white" />}
    </Link>
  );
}
