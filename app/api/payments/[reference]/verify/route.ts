import { forward } from "@/lib/server/route";

export async function POST(_req: Request, { params }: { params: { reference: string } }) {
  return forward(`/payments/${encodeURIComponent(params.reference)}/verify/`, { method: "POST" });
}
