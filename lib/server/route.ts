import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { backend } from "@/lib/server/backend";
import { applySession, clearSession, freshToken, renew } from "@/lib/server/session";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface ForwardOptions<T> {
  method: Method;
  body?: unknown;
  onSuccess?: (body: T | null, res: NextResponse) => void;
  allowGuest?: boolean;
}

export function errorResponse(status: number, message: string) {
  return NextResponse.json({ status, message }, { status });
}

export async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
  const body = await req.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? body : {};
}

const CLIENT_HINTS = ["sec-ch-ua-model", "sec-ch-ua-platform-version"];

export function clientHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = { "User-Agent": req.headers.get("user-agent") ?? "" };
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "";
  if (forwarded) headers["X-Forwarded-For"] = forwarded;
  for (const name of CLIENT_HINTS) {
    const value = req.headers.get(name);
    if (value) headers[name] = value;
  }
  return headers;
}

export async function forward<T = unknown>(path: string, options: ForwardOptions<T>): Promise<NextResponse> {
  const session = await freshToken();
  if (!session.token) {
    if (options.allowGuest) {
      const guest = await backend<T>(path, { method: options.method, body: options.body });
      if (guest.status === 502 && guest.body === null) return errorResponse(502, "Couldn't reach the server.");
      const res = NextResponse.json(guest.body ?? {}, { status: guest.status });
      if (session.ended) clearSession(res);
      return res;
    }
    const res = errorResponse(401, "Your session has ended. Log in again.");
    if (session.ended) clearSession(res);
    return res;
  }

  let token = session.token;
  let renewed = session.renewed;
  const call = () => backend<T>(path, { method: options.method, token, body: options.body });

  let upstream = await call();
  if (upstream.status === 401 && !renewed) {
    const retry = await renew();
    if (retry.renewed && retry.token) {
      renewed = retry.renewed;
      token = retry.token;
      upstream = await call();
    }
  }

  if (upstream.status === 502 && upstream.body === null) return errorResponse(502, "Couldn't reach the server.");

  const res = upstream.status === 204
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json(upstream.body ?? {}, { status: upstream.status });

  if (upstream.status === 401) {
    clearSession(res);
    return res;
  }
  if (renewed) applySession(res, renewed);
  if (upstream.ok) options.onSuccess?.(upstream.body, res);
  return res;
}
