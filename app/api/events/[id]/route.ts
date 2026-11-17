import type { NextRequest } from "next/server";
import { forward, readJson } from "@/lib/server/route";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return forward(`/events/${encodeURIComponent(params.id)}/`, { method: "PUT", body: await readJson(req) });
}
