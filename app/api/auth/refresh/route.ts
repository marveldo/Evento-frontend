import { NextResponse } from "next/server";
import { isDue } from "@/lib/auth/constants";
import { publicSession } from "@/lib/auth/tokens";
import { errorResponse } from "@/lib/server/route";
import { applySession, clearSession, freshToken, readStoredSession } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export async function POST() {
  const result = await freshToken();

  if (!result.token) {
    const res = errorResponse(401, "Your session has ended. Log in again.");
    clearSession(res);
    return res;
  }
  if (result.renewed) {
    const res = NextResponse.json({ data: publicSession(result.renewed.session) });
    applySession(res, result.renewed);
    return res;
  }

  const current = readStoredSession();
  if (!current) return errorResponse(401, "Your session has ended. Log in again.");
  // The token was due but the backend didn't renew it (network error, 5xx). Report the failure
  // instead of returning the stale session as a success; the client will retry after a pause.
  if (isDue(current.accessExpiresAt)) return errorResponse(503, "Couldn't refresh your session. Retrying shortly.");
  return NextResponse.json({ data: publicSession(current) });
}
