import { fmtChange, fmtPrice, readiness, type Stock } from "./types";

/** One line per fact — the shape these end up as in a chat or a note app. */
const factLines = (s: Stock) => s.facts.map((f) => `${f.label}: ${f.value}`);

export function headline(s: Stock) {
  const { met, total } = readiness(s);
  return [
    `${s.ticker} — ${s.name} (${s.market})`,
    `${fmtPrice(s.price)}  ${fmtChange(s.change)}`,
    `${s.status} · ${met}/${total} rules`,
  ].join("\n");
}

/** The whole journal entry, for pasting somewhere else. */
export function fullEntry(s: Stock) {
  const parts = [headline(s)];

  if (s.conds.length) {
    parts.push(
      ["Entry conditions", ...s.conds.map((c) => `${c.met ? "✓" : "☐"} ${c.text}`)].join("\n"),
    );
  }
  if (s.facts.length) {
    parts.push(["Fundamentals & catalysts", ...factLines(s)].join("\n"));
  }
  if (s.note.trim()) {
    parts.push(["Note", s.note.trim()].join("\n"));
  }
  return parts.join("\n\n");
}
