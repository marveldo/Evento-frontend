import type { NextRequest } from "next/server";
import { signIn } from "@/lib/server/auth";
import { readJson } from "@/lib/server/route";

export async function POST(req: NextRequest) {
  const { credential } = await readJson(req);
  return signIn(req, "/auth/google/", { access_token: credential });
}
