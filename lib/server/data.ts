import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { backend } from "@/lib/server/backend";
import { getAccessToken } from "@/lib/server/session";
import type { Category, Device, EventItem, NotificationItem, Order, Page, User } from "@/lib/types";

export const ATTENDEES_PER_PAGE = 5;
export const NOTIFICATIONS_PER_PAGE = 15;
export const SEARCH_PER_PAGE = 9;
export const MY_EVENTS_PER_PAGE = 6;
export const EVENTS_PER_PAGE = 6;
export const ORDERS_PER_PAGE = 10;

interface Envelope<T> {
  data: T;
}

// Thrown when the backend can't be reached (502/503/504, or no response) or answers with an error.
// Pages catch it with load() and show <LoadFailed /> instead of crashing.
export class LoadError extends Error {
  constructor(
    public status: number,
    public unavailable: boolean,
  ) {
    super(unavailable ? "The server can't be reached right now." : `The server answered with ${status}.`);
    this.name = "LoadError";
  }
}

export type Loaded<T> = { data: T; error: null } | { data: null; error: { unavailable: boolean } };

// Runs a data call and returns its failure as a value instead of throwing it. notFound() and
// redirect() still work, because they throw their own errors, which this lets through.
export async function load<T>(promise: Promise<T>): Promise<Loaded<T>> {
  try {
    return { data: await promise, error: null };
  } catch (error) {
    if (error instanceof LoadError) return { data: null, error: { unavailable: error.unavailable } };
    throw error;
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await backend<T>(path, { token: getAccessToken() });
  if (res.status === 401) {
    const next = headers().get("x-pathname") ?? "/home";
    redirect(`/api/auth/expired?next=${encodeURIComponent(next)}`);
  }
  if (res.status === 404) notFound();
  if (!res.ok || !res.body) throw new LoadError(res.status, [502, 503, 504].includes(res.status) || !res.body);
  return res.body;
}

function query(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}

export const getCategories = cache(async () => (await get<Envelope<Category[]>>("/categories/")).data);

export const getCurrentUser = cache(async () => (await get<Envelope<User>>("/auth/current-user/")).data);

export async function getEvents(tag: string, page = 1, limit = EVENTS_PER_PAGE) {
  const offset = (page - 1) * limit;
  return get<Page<EventItem>>(`/events/${query({ tag, limit, offset })}`);
}

export async function getEvent(id: string) {
  return (await get<Envelope<EventItem>>(`/events/${encodeURIComponent(id)}/`)).data;
}

export async function getAttendees(eventId: string, page: number) {
  const offset = (page - 1) * ATTENDEES_PER_PAGE;
  return get<Page<User>>(`/events/${encodeURIComponent(eventId)}/attendees/${query({ limit: ATTENDEES_PER_PAGE, offset })}`);
}

export async function getDevices() {
  return (await get<Envelope<Device[]>>("/auth/devices/")).data;
}

export async function getOrders(page: number) {
  const offset = (page - 1) * ORDERS_PER_PAGE;
  return get<Page<Order>>(`/orders/${query({ limit: ORDERS_PER_PAGE, offset })}`);
}

export async function getNotifications(page: number) {
  const offset = (page - 1) * NOTIFICATIONS_PER_PAGE;
  return get<Page<NotificationItem>>(`/notifications/${query({ limit: NOTIFICATIONS_PER_PAGE, offset })}`);
}

export async function searchEvents(text: string, page: number) {
  const offset = (page - 1) * SEARCH_PER_PAGE;
  return get<Page<EventItem>>(`/events/${query({ search: text, limit: SEARCH_PER_PAGE, offset })}`);
}

export interface MyEventsQuery {
  when: "upcoming" | "past";
  role?: "hosting" | "attending";
  price?: "free" | "paid";
  page: number;
}

// Events the current user hosts or registered for.
export async function getMyEvents({ when, role, price, page }: MyEventsQuery) {
  const offset = (page - 1) * MY_EVENTS_PER_PAGE;
  return get<Page<EventItem>>(`/auth/current-user/events/${query({ when, role, price, limit: MY_EVENTS_PER_PAGE, offset })}`);
}
