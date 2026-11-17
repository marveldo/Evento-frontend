import { forward } from "@/lib/server/route";

export async function POST() {
  return forward("/auth/socket-token/", { method: "POST" });
}
