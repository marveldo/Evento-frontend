# Evento frontend

Next.js 14 (App Router) frontend for [evento-api](../evento-api).

## Setup

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

| variable | |
|---|---|
| `BACKEND_URL` | evento-api base URL including `/api/v1`, e.g. `http://127.0.0.1:10000/api/v1`. Server-side only. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client id (same as the backend's `GOOGLE_CLIENT_ID`). Leave empty to hide Google sign-in. |

Node 22 is required (the notifications route uses Node's built-in `WebSocket`).

## How it fits together

```
app/                 pages (server components) and app/api route handlers
components/
  ui/                shadcn components
  common/            Container, LoadingButton, Pagination, TabLinks, UserAvatar, icons...
  form/              TextField, DateTimeFields, ImageDropzone (react-hook-form)
  events/ auth/ dashboard/ settings/ layout/
  providers/         SessionProvider, NotificationsListener, Providers
lib/
  api/client.ts      browser calls to /api/* (api.login, api.createEvent, ...)
  api/photos.ts      signed Cloudinary upload
  server/data.ts     server-side fetches for pages (getEvent, getCurrentUser, ...)
  server/route.ts    forward(): route handler -> backend with the cookie token
  server/session.ts  reading and writing the session cookies
  auth/tokens.ts     cookie names, token refresh (shared with middleware)
  schemas/           zod schemas for the forms
middleware.ts        protects pages and refreshes the session before they render
```

**Session.** Tokens live in httpOnly cookies (`evento_access`, `evento_refresh`, `evento_session`) that only the
Next.js server reads; the browser never sees a token. The backend sends `access_expiry` and
`refresh_expiry` (ISO 8601 UTC timestamps) with every login and refresh. If they're missing, the expiry is
read from the token's `exp` claim instead:

- the access cookie expires with the access token, and `evento_session` stores when that is;
- `SessionProvider` refreshes a minute before expiry (a `useEffect` timer, and again when the tab becomes
  visible after sleeping) through `POST /api/auth/refresh`;
- `middleware.ts` refreshes before rendering a page if the token has already run out;
- route handlers retry once with a fresh token if the backend answers 401.

Refresh tokens are single use, so concurrent refreshes on one server share one backend call.

**Data.** Pages fetch on the server (`lib/server/data.ts`) and pass data to the client components that need
interaction. Mutations go from the browser to `app/api/*`, which forwards them with the token.

**Notifications.** `GET /api/notifications` opens the backend WebSocket on the server and streams it to the
browser as Server-Sent Events, so the token stays in the cookie. When the device is logged out, the stream
sends a `logout` event and the session ends.

**Photos.** The browser asks `/api/photos/signature` for a signed Cloudinary upload, sends the file straight
to Cloudinary, then saves the returned `public_id` as `profile_img` or `event_image`.
