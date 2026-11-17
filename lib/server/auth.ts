import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { backend } from "@/lib/server/backend";
import { clientHeaders, errorResponse, readJson } from "@/lib/server/route";
import { publicSession, sessionFromPayload, writeSession, type AuthPayload } from "@/lib/auth/tokens";

export async function signIn(req: NextRequest, path: string, body?: Record<string, unknown>) {
  const upstream = await backend<AuthPayload>(path, {
    method: "POST",
    body: body ?? (await readJson(req)),
    headers: clientHeaders(req),
  });

  if (upstream.status === 502 && !upstream.body) return errorResponse(502, "Couldn't reach the server.");
  if (!upstream.ok || !upstream.body?.access) {
    return NextResponse.json(upstream.body ?? { message: "Login failed." }, { status: upstream.status });
  }

  const session = sessionFromPayload(upstream.body);
  const res = NextResponse.json({ data: publicSession(session) }, { status: upstream.status });
  writeSession(res.cookies, { access: upstream.body.access, refresh: upstream.body.refresh }, session);
  return res;
}
