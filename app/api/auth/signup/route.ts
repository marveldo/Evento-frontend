import { NextResponse, type NextRequest } from "next/server";
import { backend } from "@/lib/server/backend";
import { readJson } from "@/lib/server/route";

export async function POST(req: NextRequest) {
  const upstream = await backend("/auth/register/", { method: "POST", body: await readJson(req) });
  return NextResponse.json(upstream.body ?? { message: "Couldn't reach the server." }, { status: upstream.status });
}
