import type { NextRequest } from "next/server";
import { forward, readJson } from "@/lib/server/route";
import { updateSessionUser } from "@/lib/server/session";
import type { User } from "@/lib/types";

export async function PUT(req: NextRequest) {
  return forward<{ data: User }>("/auth/current-user/interests/", {
    method: "PUT",
    body: await readJson(req),
    onSuccess: (body, res) => {
      if (body?.data) updateSessionUser(res, { role: body.data.role, onboarded: body.data.onboarded });
    },
  });
}
