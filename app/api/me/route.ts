import type { NextRequest } from "next/server";
import { forward, readJson } from "@/lib/server/route";
import { clearSession, updateSessionUser } from "@/lib/server/session";
import type { User } from "@/lib/types";

export async function PUT(req: NextRequest) {
  return forward<{ data: User }>("/auth/current-user/", {
    method: "PUT",
    body: await readJson(req),
    onSuccess: (body, res) => {
      if (body?.data) updateSessionUser(res, { name: body.data.full_name ?? "", email: body.data.email, image: body.data.profile_img });
    },
  });
}

export async function DELETE() {
  return forward("/auth/current-user/", { method: "DELETE", onSuccess: (_, res) => clearSession(res) });
}
