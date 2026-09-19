# Stock Entry Journal

A mobile entry-journal screen for tracking tickers against your own entry rules —
imported from the [Claude Design project](https://claude.ai/design/p/13d35b40-011c-452d-b790-ce640ba45582).

Three screens, all in one declarative-component page:

- **Watchlist** — cards per ticker with price, change, a readiness bar (`met/total`
  entry conditions) and a status tag. Filter by status, cycle the sort between
  Readiness / Symbol / Change.
- **Detail** — set status, tick off or remove entry conditions, add new ones, keep
  fundamentals & catalysts as label/value rows, and a free-text note.
- **New ticker** — symbol, name, market (SET / US / Crypto), reference price and a
  first entry condition.

State lives in the component and resets on reload; there is no persistence layer yet.

## Files

| Path | What it is |
| --- | --- |
| `Stock Entry Journal.dc.html` | The page: `<x-dc>` template (`sc-if` / `sc-for` bindings) plus the `DCLogic` component that holds state and computes render values. |
| `support.js` | The dc-runtime that compiles `<x-dc>` into React. Generated — do not edit. |
| `ios-frame.jsx` | iOS device frame (bezel, status bar, home indicator), exported to the global scope as `IOSDevice` and pulled in via `<x-import>`. |
| `_ds/nocturne-4c471785-2541-4499-9f02-478487a1a07f/styles.css` | Nocturne design-system tokens and component classes (`.btn`, `.input`, `.field`, `.tag`). Source of truth for the look. |
| `_ds/nocturne-4c471785-2541-4499-9f02-478487a1a07f/_ds_bundle.js` | Nocturne's JS bundle. CSS-only system, so it just registers the namespace. |

## Running it

`support.js` fetches `ios-frame.jsx` at runtime, so opening the file over `file://`
will not work — serve the directory instead:

```bash
python3 -m http.server 8000
# → http://localhost:8000/Stock%20Entry%20Journal.dc.html
```

Three things load from the network on first paint:

- React 18.3.1, ReactDOM 18.3.1 and Babel standalone 7.29.0, fetched from unpkg by
  `support.js` (with SRI) — Babel compiles `ios-frame.jsx` in the browser.
- Phosphor icons 2.1.1 (`regular` + `bold`), linked from unpkg.
- Inter 400/500/600/700, imported from Google Fonts by `styles.css`.
