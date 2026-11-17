import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/session";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ data: getSession() }, { headers: { "Cache-Control": "no-store" } });
}
