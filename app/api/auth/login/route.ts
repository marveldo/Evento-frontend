import type { NextRequest } from "next/server";
import { signIn } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  return signIn(req, "/auth/login/");
}
