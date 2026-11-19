import type { NextRequest } from "next/server";
import { forward, readJson } from "@/lib/server/route";

// GET /api/events?search=...&limit=... : used by the search box for live results.
export async function GET(req: NextRequest) {
  const params = new URLSearchParams();
  const search = req.nextUrl.searchParams.get("search")?.trim().slice(0, 100);
  const limit = Number(req.nextUrl.searchParams.get("limit"));
  if (search) params.set("search", search);
  params.set("limit", String(Number.isInteger(limit) && limit > 0 ? Math.min(limit, 20) : 5));
  return forward(`/events/?${params}`, { method: "GET", allowGuest: true });
}

export async function POST(req: NextRequest) {
  return forward("/events/", { method: "POST", body: await readJson(req) });
}
