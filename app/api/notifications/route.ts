import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/auth/tokens";
import { applySession, clearSession, freshToken } from "@/lib/server/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LOGGED_OUT = 4401;
const KEEP_ALIVE_MS = 20_000;
const RECONNECT_MS = 5_000;

function socketUrl(token: string) {
  const origin = new URL(BACKEND_URL).origin.replace(/^http/, "ws");
  return `${origin}/ws/notifications/?access_token=${encodeURIComponent(token)}`;
}

export async function GET(req: NextRequest) {
  const session = await freshToken();
  if (!session.token) {
    const res = new NextResponse("Unauthorized", { status: 401 });
    if (session.ended) clearSession(res);
    return res;
  }

  const url = socketUrl(session.token);
  const encoder = new TextEncoder();
  // Node's WebSocket sends no Origin header, and the backend refuses sockets whose origin isn't in
  // CORS_ALLOWED_ORIGINS. Send this site's origin, like a browser would.
  const socketOptions = { headers: { Origin: req.nextUrl.origin } } as unknown as string[];

  const stream = new ReadableStream({
    start(controller) {
      const socket = new WebSocket(url, socketOptions);
      let closed = false;

      const write = (chunk: string) => {
        if (!closed) controller.enqueue(encoder.encode(chunk));
      };
      const keepAlive = setInterval(() => write(": keep-alive\n\n"), KEEP_ALIVE_MS);
      const end = () => {
        if (closed) return;
        closed = true;
        clearInterval(keepAlive);
        try {
          socket.close();
        } catch {}
        controller.close();
      };

      write(`retry: ${RECONNECT_MS}\n\n`);
      socket.onmessage = (event) => {
        if (typeof event.data === "string") write(`data: ${event.data}\n\n`);
      };
      socket.onclose = (event) => {
        if (event.code === LOGGED_OUT) write("event: logout\ndata: {}\n\n");
        end();
      };
      socket.onerror = end;
      req.signal.addEventListener("abort", end);
    },
  });

  const res = new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
  if (session.renewed) applySession(res, session.renewed);
  return res;
}
