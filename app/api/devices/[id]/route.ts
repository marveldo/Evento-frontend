import { forward } from "@/lib/server/route";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  return forward(`/auth/logout-device/${encodeURIComponent(params.id)}/`, { method: "DELETE" });
}
