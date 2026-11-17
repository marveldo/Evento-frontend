import type { NextRequest } from "next/server";
import { forward, readJson } from "@/lib/server/route";

export async function POST(req: NextRequest) {
  const { kind } = await readJson(req);
  return forward("/photos/signature/", { method: "POST", body: { kind } });
}
