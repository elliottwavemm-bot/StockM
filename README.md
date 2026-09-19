# Stock Entry Journal

A mobile-first web app for tracking tickers against your own entry rules, instead of
buying on a hunch. Built from the
[Claude Design project](https://claude.ai/design/p/13d35b40-011c-452d-b790-ce640ba45582)
kept in [`design/`](#design-source).

- **Watchlist** — a card per ticker with price, change, a readiness bar (`met/total`
  entry conditions ticked) and a status tag. Filter by status, cycle the sort between
  Readiness / Symbol / Change.
- **Ticker detail** — set the status, tick off, add and remove entry conditions, keep
  fundamentals & catalysts as label/value rows, and write a free note. Removing the
  ticker asks first.
- **New ticker** — symbol, name, market (SET / US / Crypto), reference price and a first
  entry condition. The symbol is upper-cased and the price accepts `1,240`.

Everything is stored in the browser's `localStorage` under `stockm.journal.v1` — no
account, no server, and nothing leaves the device. The first visit is seeded with four
example tickers.

**Live: https://elliottwavemm-bot.github.io/StockM/**

It installs as a PWA: add it to the home screen and it opens standalone, with no browser
chrome, and works with no connection at all.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Typechecks, then builds static files into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run typecheck` | `tsc --noEmit` on its own |

`dist/` is a plain static bundle with relative asset paths, so it can be hosted from any
directory — GitHub Pages, Netlify, an S3 bucket, or any local file server. Nothing is
fetched from a third party at runtime: Inter ships in the bundle.

## Offline and install

A service worker (Workbox, via `vite-plugin-pwa`) precaches the whole app — HTML, JS, CSS,
the four Inter weights and the icons, about 284 KB — so after the first load it runs with
no network, including a cold start and a deep link into a ticker. It claims the page on
that first visit, so installing and immediately losing signal still leaves a working app.
A new build takes over automatically on the next load.

The parts that make it installable:

| File | Role |
| --- | --- |
| `vite.config.ts` → `VitePWA({…})` | Manifest and service worker: standalone display, portrait, `#161826` theme, icons at 192 / 512 / 512-maskable. |
| `src/main.tsx` | Registers the worker. Sandboxed frames and plain `http://` origins refuse it; the app runs the same either way, so the failure is swallowed. |
| `public/icon.svg` | The source icon. `icon-192.png`, `icon-512.png` and `apple-touch-icon.png` are rendered from it. |

A service worker needs an `https://` origin (or `localhost`), and browsers block it inside
a sandboxed preview frame. Install and offline therefore work on the Pages URL above and
on `npm run preview` at localhost — but not through an embed or preview frame, where the
browser also reads the *framing* page's icons instead of the app's.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to
`claude/test-eavkc0`, and can be run by hand from the Actions tab. The app's `base: "./"`
means the `/StockM/` subpath needs no special handling, and hash routing means Pages needs
no rewrite rules.

One setting has to be right, once: **Settings → Pages → Build and deployment → Source**
must be **GitHub Actions**. If it is left on "Deploy from a branch", the `build` job still
succeeds and uploads the artifact, but the `deploy` job is rejected before it starts — it
fails in about a second with no steps and no log, which is the signature of that
misconfiguration rather than of a broken build.

## Layout

```
.github/workflows/    Pages deployment
index.html            Vite entry
src/
  main.tsx            mounts App, imports the design system + screen styles
  App.tsx             routing, filter and sort state
  router.ts           hash routing (#/, #/t/<id>, #/new) so Back walks the screens
  store.ts            useJournal() — the ticker list and every mutation, persisted
  types.ts            Stock/Condition/Fact, plus price, change and readiness formatting
  seed.ts             first-run example tickers
  app.css             screen layout and the app shell
  screens/            Watchlist, TickerDetail, NewTicker
public/               PWA icons, copied to dist/ as-is
design/               the Claude Design project this was built from
```

The visual language — colours, type, radii, shadows, and the `.btn` / `.input` / `.field`
/ `.tag` classes — comes from the Nocturne design system in
`design/_ds/nocturne-…/styles.css`, which `main.tsx` imports directly. That file stays the
single source of truth for the look: retune it there and the app follows. A build-time
transform drops that file's Google Fonts `@import`, since the app bundles the same Inter
weights from `@fontsource` to stay offline-capable — the design file itself is untouched.
Icons are Phosphor, imported as React components so only the handful in use gets bundled.

<a id="design-source"></a>

## Design source

`design/` holds the original Claude Design project, unchanged and still openable on its
own:

| Path | What it is |
| --- | --- |
| `Stock Entry Journal.dc.html` | The design page: an `<x-dc>` template with `sc-if` / `sc-for` bindings plus a `DCLogic` class. |
| `support.js` | The dc-runtime that compiles that template into React. Generated — do not edit. |
| `ios-frame.jsx` | iOS device frame the design is previewed inside. |
| `_ds/nocturne-…/styles.css` | Nocturne tokens and component classes. |
| `_ds/nocturne-…/_ds_bundle.js` | Nocturne's JS bundle — CSS-only system, so it just registers the namespace. |

It needs a server rather than `file://`, because the runtime fetches `ios-frame.jsx`:

```bash
npx vite preview --outDir design   # or any static server rooted at design/
```

The app deliberately drops the iOS bezel and fake status bar that the design previews
inside, and is responsive instead: full-bleed on a phone, a centred column on anything
wider.
