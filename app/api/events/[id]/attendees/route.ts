import type { NextRequest } from "next/server";
import { forward, readJson } from "@/lib/server/route";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return forward(`/events/${encodeURIComponent(params.id)}/attendees/`, { method: "POST", body: await readJson(req) });
}
