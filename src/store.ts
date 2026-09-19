import { useCallback, useEffect, useState } from "react";
import { seedStocks } from "./seed";
import { uid, type Condition, type Fact, type Stock } from "./types";

const KEY = "stockm.journal.v1";

function load(): Stock[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedStocks();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Stock[]) : seedStocks();
  } catch {
    // Private mode, blocked site data, or a half-written entry — start fresh
    // rather than leaving the app with nothing to render.
    return seedStocks();
  }
}

export function useJournal() {
  const [stocks, setStocks] = useState<Stock[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(stocks));
    } catch {
      /* over quota or storage blocked — the session still works, it just won't persist */
    }
  }, [stocks]);

  const patch = useCallback((id: string, fn: (s: Stock) => Stock) => {
    setStocks((all) => all.map((s) => (s.id === id ? fn(s) : s)));
  }, []);

  const add = useCallback((s: Stock) => setStocks((all) => [...all, s]), []);

  const remove = useCallback(
    (id: string) => setStocks((all) => all.filter((s) => s.id !== id)),
    [],
  );

  const setStatus = useCallback(
    (id: string, status: Stock["status"]) => patch(id, (s) => ({ ...s, status })),
    [patch],
  );

  const setNote = useCallback(
    (id: string, note: string) => patch(id, (s) => ({ ...s, note })),
    [patch],
  );

  const addCond = useCallback(
    (id: string, text: string) =>
      patch(id, (s) => ({ ...s, conds: [...s.conds, { id: uid(), text, met: false }] })),
    [patch],
  );

  const toggleCond = useCallback(
    (id: string, condId: string) =>
      patch(id, (s) => ({
        ...s,
        conds: s.conds.map((c: Condition) => (c.id === condId ? { ...c, met: !c.met } : c)),
      })),
    [patch],
  );

  const removeCond = useCallback(
    (id: string, condId: string) =>
      patch(id, (s) => ({ ...s, conds: s.conds.filter((c) => c.id !== condId) })),
    [patch],
  );

  const addFact = useCallback(
    (id: string, label: string, value: string) =>
      patch(id, (s) => ({ ...s, facts: [...s.facts, { id: uid(), label, value }] })),
    [patch],
  );

  const removeFact = useCallback(
    (id: string, factId: string) =>
      patch(id, (s) => ({ ...s, facts: s.facts.filter((f: Fact) => f.id !== factId) })),
    [patch],
  );

  return {
    stocks,
    add,
    remove,
    setStatus,
    setNote,
    addCond,
    toggleCond,
    removeCond,
    addFact,
    removeFact,
  };
}

export type Journal = ReturnType<typeof useJournal>;
