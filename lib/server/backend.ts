import "server-only";
import { BACKEND_URL } from "@/lib/auth/tokens";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export interface BackendRequest {
  method?: Method;
  token?: string | null;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface BackendResponse<T = unknown> {
  ok: boolean;
  status: number;
  body: T | null;
}

export async function backend<T = unknown>(path: string, request: BackendRequest = {}): Promise<BackendResponse<T>> {
  const headers: Record<string, string> = { Accept: "application/json", ...request.headers };
  if (request.body !== undefined) headers["Content-Type"] = "application/json";
  if (request.token) headers.Authorization = `Bearer ${request.token}`;

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method: request.method ?? "GET",
      headers,
      body: request.body === undefined ? undefined : JSON.stringify(request.body),
      cache: "no-store",
    });
    const body = res.status === 204 ? null : ((await res.json().catch(() => null)) as T | null);
    return { ok: res.ok, status: res.status, body };
  } catch {
    return { ok: false, status: 502, body: null };
  }
}
