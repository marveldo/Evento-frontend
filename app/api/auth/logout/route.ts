import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIES } from "@/lib/auth/tokens";
import { backend } from "@/lib/server/backend";
import { clearSession, readStoredSession } from "@/lib/server/session";

export async function POST() {
  const refresh = cookies().get(COOKIES.refresh)?.value;
  const session = readStoredSession();
  if (refresh && session) {
    await backend("/auth/logout/", {
      method: "POST",
      body: { refresh_token: refresh, device_id: session.user.deviceId },
    });
  }

  const res = NextResponse.json({ data: null });
  clearSession(res);
  return res;
}
