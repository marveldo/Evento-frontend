import type { EventItem, FieldError, PhotoKind, PhotoSignature, Session, SocketToken, User } from "@/lib/types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: FieldError[] = [],
  ) {
    super(message);
  }
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface ErrorBody {
  message?: string;
  detail?: string;
  errors?: FieldError[];
}

function errorMessage(status: number, body: ErrorBody | null) {
  if (body?.errors?.length) return body.errors[0]!.message;
  return body?.message ?? body?.detail ?? `Request failed (${status})`;
}

async function request<T>(method: Method, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
      cache: "no-store",
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, "Couldn't reach the server. Check your connection and try again.");
  }

  const json = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, errorMessage(res.status, json), json?.errors ?? []);
  return (json?.data ?? null) as T;
}

export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  full_name?: string;
  email?: string;
  password?: string;
  profile_img?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface CreateEventInput {
  event_name: string;
  description: string;
  start_date: string;
  start_time: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  location: string;
  event_category: string;
  event_image: string;
}

// Same as creating, but event_image is optional: leave it out to keep the current image.
export type UpdateEventInput = Omit<CreateEventInput, "event_image"> & { event_image?: string };

export const api = {
  login: (email: string, password: string) => request<Session>("POST", "/auth/login", { email, password }),
  google: (credential: string) => request<Session>("POST", "/auth/google", { credential }),
  signup: (input: RegisterInput) => request<User>("POST", "/auth/signup", input),
  logout: () => request<null>("POST", "/auth/logout"),
  refresh: () => request<Session>("POST", "/auth/refresh"),
  session: () => request<Session | null>("GET", "/auth/session"),

  updateMe: (input: UpdateUserInput) => request<User>("PUT", "/me", input),
  deleteMe: () => request<null>("DELETE", "/me"),
  logoutDevice: (id: string) => request<null>("DELETE", `/devices/${id}`),

  createEvent: (input: CreateEventInput) => request<EventItem>("POST", "/events", input),
  updateEvent: (id: string, input: UpdateEventInput) => request<EventItem>("PUT", `/events/${encodeURIComponent(id)}`, input),
  registerForEvent: (eventId: string, email: string) => request<User[]>("POST", `/events/${eventId}/attendees`, { email }),
  searchEvents: (text: string, limit = 5, signal?: AbortSignal) =>
    request<EventItem[]>("GET", `/events?search=${encodeURIComponent(text)}&limit=${limit}`, undefined, signal),

  photoSignature: (kind: PhotoKind) => request<PhotoSignature>("POST", "/photos/signature", { kind }),
  socketToken: () => request<SocketToken>("POST", "/notifications/socket-token"),
};
