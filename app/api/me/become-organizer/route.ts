import { forward } from "@/lib/server/route";
import { updateSessionUser } from "@/lib/server/session";
import type { User } from "@/lib/types";

export async function POST() {
  return forward<{ data: User }>("/auth/current-user/become-organizer/", {
    method: "POST",
    onSuccess: (body, res) => {
      if (body?.data) updateSessionUser(res, { role: body.data.role, onboarded: body.data.onboarded });
    },
  });
}
