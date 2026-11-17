// Lets the parts of the page that show notifications react when one arrives live:
// NotificationsListener announces it, the navbar bell shows a dot, and the notifications page reloads.

const NEW_NOTIFICATION = "evento:notification";
const UNREAD_KEY = "evento:unread-notifications";

export function announceNotification() {
  // Already looking at the notifications page: it reloads itself, so nothing is unread.
  setUnread(window.location.pathname !== "/notifications");
  window.dispatchEvent(new Event(NEW_NOTIFICATION));
}

export function onNotification(callback: () => void) {
  window.addEventListener(NEW_NOTIFICATION, callback);
  return () => window.removeEventListener(NEW_NOTIFICATION, callback);
}

// The unread flag is a per-browser convenience, so it lives in localStorage. Storage can be
// unavailable (private windows, blocked site data), so every access is guarded.
export function hasUnread() {
  try {
    return window.localStorage.getItem(UNREAD_KEY) === "1";
  } catch {
    return false;
  }
}

export function setUnread(unread: boolean) {
  try {
    if (unread) window.localStorage.setItem(UNREAD_KEY, "1");
    else window.localStorage.removeItem(UNREAD_KEY);
  } catch {}
}
