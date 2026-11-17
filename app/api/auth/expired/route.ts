import { NextResponse, type NextRequest } from "next/server";
import { loginUrl, safeNext } from "@/lib/navigation";
import { clearSession } from "@/lib/server/session";

export async function GET(req: NextRequest) {
  const next = safeNext(req.nextUrl.searchParams.get("next"));
  const res = NextResponse.redirect(new URL(loginUrl(next), req.url));
  clearSession(res);
  return res;
}
