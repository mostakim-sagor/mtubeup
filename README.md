# M-TUBE
### POWER BY : MOSTAKIM LAB'S

A production-ready Next.js (App Router) media downloader powered by `@media-downloaders/v2`. It keeps the original M-TUBE query-parameter UI and connects it to real, validated `/api/info` and `/api/download` routes.

## Features

- Query-parameter routing (`/~`, `/?download`, `/?api`, …) — no subdomains, no extra physical routes
- No login, no accounts, no database — history/settings live in `localStorage`
- No user API keys — the public API is scoped to whatever domain it's deployed on
- Zod-validated, SSRF-protected, rate-limited API routes
- Real downloader output is streamed directly through `POST /api/download`
- Downloader files are temporary package outputs and are deleted after the browser response closes
- Fixed light theme, responsive mobile-first UI preserving the original M-TUBE design
- Deployable to Vercel with zero extra infrastructure

## Tech stack

Next.js 15 (App Router) · React 18 · Zod · `@media-downloaders/v2` · plain CSS — no database or login system.

## Installation

```bash
npm install
node index.js
```

Visit `http://localhost:5000/~`.

`index.js` uses port `5000` by default and honors `process.env.PORT` when it is set.

## Scripts

```bash
npm run dev     # local development
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Environment variables

The app runs without a database or login configuration. Optional variables are listed in `.env.example`.

| Variable | Purpose |
|---|---|
| `MTUBE_YOUTUBE_COOKIE` | Optional server-only YouTube cookie, if the source requires authentication |
| `MTUBE_YOUTUBE_MAX_DURATION` | Maximum YouTube duration in seconds; defaults to `1800` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` | API rate limit tuning |
| `NEXT_PUBLIC_SUPPORT_*` | Support page contact links |

## Routing

No subdomains, no nested physical routes for the app pages. A single root route (`app/page.js`) reads `searchParams` and renders the matching page component; the canonical home route is `app/~/page.js`.

| URL | Page |
|---|---|
| `/~` | Home |
| `/?download` | Download |
| `/?downloads` | Downloads |
| `/?finished` | Finished |
| `/?settings` | Settings |
| `/?api` | API docs |
| `/?support` | Support |
| `/?terms` | Terms & Conditions |
| `/?privacy` | Privacy Policy |
| `/` (no query) | Redirects to `/~` |
| `/` with an unrecognized query | Renders Home inline |

Because these are real URLs handled by Next.js's router, browser back/forward and refresh all work natively — no custom history hacking required.

## API documentation

Base URL is derived from the current origin at request time — never hard-coded. See it live at `/?api`, or:

**POST `/api/info`**
```json
{ "url": "https://example.com/video" }
```
Response for a supported URL with real metadata:
```json
{
  "success": true,
  "provider": "@media-downloaders/v2",
  "platform": "TikTok",
  "title": "Actual media title",
  "thumbnail": "https://actual-thumbnail-url",
  "formats": [
    { "type": "video", "quality": "original", "container": "mp4" }
  ]
}
```

**POST `/api/download`**
```json
{ "url": "https://example.com/video", "format": "mp4", "quality": "720p" }
```

`POST /api/download` downloads the source using `@media-downloaders/v2` and streams the verified non-empty result in the same response with `Content-Disposition: attachment`. The frontend converts that response to a browser download, so Android/browser controls the default Downloads location. No server-side download folder or job store is used.

`GET /api/status/[jobId]` is intentionally unavailable because downloads are streamed directly and are not stored as server-side jobs.

No API key is required for any endpoint. Rate limiting and SSRF protection apply to all of them regardless.

## Downloader architecture

`lib/downloader.js` is the application adapter around `@media-downloaders/v2`. The adapter:

- uses the package's real downloader for supported URLs;
- fetches real title/thumbnail metadata from platform metadata endpoints;
- serializes calls because the package writes temporary files in the process directory;
- checks that the returned path is an expected non-empty file;
- streams the verified file directly to the browser;
- deletes the package temp file after the response closes.

The `/api/info` response reports the actual output this backend can produce: the package currently returns an original-quality MP4 file. The app does not claim unsupported audio conversion, quality conversion, progress, or metadata that the package did not provide.

## Security

- **Validation:** every request body is parsed against a Zod schema (`lib/validation.js`) before anything else runs.
- **SSRF protection:** `lib/security.js` rejects `file://`, non-http(s) protocols, `localhost`, loopback/private IP ranges, and cloud metadata addresses before a URL ever reaches a provider.
- **Rate limiting:** `lib/rateLimit.js` is a best-effort, in-memory, per-IP limiter (see the note in that file about swapping in a durable store like Upstash Redis for strict cross-instance limits in production).
- **Safe errors:** unexpected errors are logged server-side only; the client always gets a generic, safe message (`lib/security.js#toSafeErrorResponse`).
- **Secrets:** provider credentials live only in environment variables, read only in server-side route/provider code. Nothing under `NEXT_PUBLIC_*` holds a secret.
- **No anti-DevTools tricks:** production hardening is standard Next.js minification/no-sourcemaps plus a few response headers (`next.config.js`) — not right-click/F12 blockers, which don't actually protect anything.

## Local storage

`lib/storage.js` wraps `localStorage` for settings, active downloads, and finished downloads. Nothing here is ever sent to a server. Users can clear it from `/?settings`.

## Branding / logo

Replace `public/m.tube.lite.png` with your real asset (same filename) — the `Logo` component (`components/Logo.jsx`) falls back to an inline SVG mark automatically if the file is missing, so the UI never shows a broken image either way.

## Deploying to Vercel

The repository includes `vercel.json` with the npm install and Next.js build settings.

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import it into Vercel — the Next.js framework is configured automatically.
3. Add any variables from `.env.example` in the Vercel project settings.
4. Deploy. No database, no VPS, no custom server required.

## Deploying to Render

The repository includes `render.yaml` for a Render Web Service.

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint** and select the repository.
3. Render runs `npm install && npm run build`, then starts `npm run start`.
4. Add `MTUBE_YOUTUBE_COOKIE` only if the downloader needs it for the source being used.

Render supplies `PORT` automatically; `index.js` honors it. The `/~` route is configured as the health check.

## Known limitations

- `@media-downloaders/v2` may require a valid `MTUBE_YOUTUBE_COOKIE` for some YouTube links.
- Rate limiting is per-warm-instance, not globally atomic, without adding a durable store.
- The backend package may require a valid `MTUBE_YOUTUBE_COOKIE` for YouTube downloads.
- No automated tests are included in this scaffold.

## Legal / usage note

M-TUBE is a tool for downloading content you have permission to download and use. It does not host, store, or distribute any third-party content itself, and it is not designed to bypass authentication, DRM, paywalls, or access controls.

## Project structure

```
app/
  page.js                Root query-param resolver ("/")
  ~/page.js               Canonical Home route ("/~")
  layout.js               Root layout, SEO metadata
  globals.css
  api/
    info/route.js
    download/route.js
    status/[jobId]/route.js

components/
  Header.jsx  Footer.jsx  BottomNav.jsx  Logo.jsx  PlatformIcon.jsx
  pages/
    Home.jsx  Download.jsx  Downloads.jsx  Finished.jsx
    Settings.jsx  Api.jsx  Support.jsx  Terms.jsx  Privacy.jsx

lib/
  config.js  router.js  platform.js  validation.js  security.js  rateLimit.js
  api.js  storage.js
  downloader.js
  providers/                Legacy provider adapters kept for structure compatibility

public/
  m.tube.lite.png

.env.example
package.json
next.config.js
jsconfig.json
.eslintrc.json
README.md
```
