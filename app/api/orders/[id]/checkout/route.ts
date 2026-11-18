import { forward } from "@/lib/server/route";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  return forward(`/orders/${encodeURIComponent(params.id)}/checkout/`, { method: "POST" });
}
