export const STATUSES = ["Watching", "Ready", "Holding", "Sold"] as const;
export const MARKETS = ["SET", "US", "Crypto"] as const;
export const SORTS = ["Readiness", "Symbol", "Change"] as const;

export type Status = (typeof STATUSES)[number];
export type Market = (typeof MARKETS)[number];
export type Sort = (typeof SORTS)[number];

export interface Condition {
  id: string;
  text: string;
  met: boolean;
}

export interface Fact {
  id: string;
  label: string;
  value: string;
}

export interface Stock {
  id: string;
  ticker: string;
  name: string;
  market: Market;
  price: number;
  change: number;
  status: Status;
  conds: Condition[];
  facts: Fact[];
  note: string;
}

export const uid = () => Math.random().toString(36).slice(2, 9);

/** Price the way the journal shows it: thousands rounded, small prices to the cent. */
export const fmtPrice = (n: number) =>
  n >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toFixed(2);

export const fmtChange = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

/** How much of the entry checklist is ticked off — the list's readiness bar. */
export function readiness(s: Stock) {
  const total = s.conds.length;
  const met = s.conds.filter((c) => c.met).length;
  return { met, total, pct: total ? Math.round((met / total) * 100) : 0 };
}
