import { useState } from "react";
import { CaretLeft, Check, Plus, Trash, X } from "@phosphor-icons/react";
import { useCopy } from "../copy";
import { go } from "../router";
import { fullEntry } from "../share";
import { useLongPress } from "../useLongPress";
import type { Journal } from "../store";
import { fmtChange, fmtPrice, readiness, STATUSES, type Stock } from "../types";

interface Props {
  stock: Stock;
  journal: Journal;
}

/** A detail row that copies its own text when held. */
function HoldRow({ copyText, children }: { copyText: string; children: React.ReactNode }) {
  const copy = useCopy();
  const hold = useLongPress(() => copy(copyText));
  return (
    <div className="row holdable" {...hold}>
      {children}
    </div>
  );
}

export default function TickerDetail({ stock, journal }: Props) {
  const copy = useCopy();
  const holdHead = useLongPress(() => copy(fullEntry(stock), `${stock.ticker} entry`));
  const [newCond, setNewCond] = useState("");
  const [factLabel, setFactLabel] = useState("");
  const [factValue, setFactValue] = useState("");
  const { met, total } = readiness(stock);

  const addCond = () => {
    const t = newCond.trim();
    if (!t) return;
    journal.addCond(stock.id, t);
    setNewCond("");
  };

  const addFact = () => {
    const l = factLabel.trim();
    const v = factValue.trim();
    if (!l && !v) return;
    journal.addFact(stock.id, l || "Note", v);
    setFactLabel("");
    setFactValue("");
  };

  const removeTicker = () => {
    if (!confirm(`Remove ${stock.ticker} from the watchlist?`)) return;
    journal.remove(stock.id);
    go.list();
  };

  return (
    <div className="screen">
      <div className="topbar">
        <button className="btn btn-ghost" onClick={go.back}>
          <CaretLeft size={14} weight="bold" />
          Watchlist
        </button>
        <div className="topbar-spacer" />
        <button
          className="btn btn-ghost danger"
          onClick={removeTicker}
          aria-label={`Remove ${stock.ticker}`}
        >
          <Trash size={16} />
        </button>
      </div>

      <div className="scroll">
        <div className="pane">
          <div className="detail-head holdable" {...holdHead}>
            <div style={{ flex: 1 }}>
              <div className="detail-symbol">{stock.ticker}</div>
              <div className="detail-sub">
                {stock.name} · {stock.market}
              </div>
            </div>
            <div className="price-col">
              <div className="detail-price">{fmtPrice(stock.price)}</div>
              <div className={"detail-chg chg " + (stock.change >= 0 ? "up" : "down")}>
                {fmtChange(stock.change)}
              </div>
            </div>
          </div>

          <div className="pick-row" style={{ marginBottom: 16 }} role="group" aria-label="Status">
            {STATUSES.map((label) => (
              <button
                key={label}
                className="pick pick-wide"
                aria-pressed={stock.status === label}
                onClick={() => journal.setStatus(stock.id, label)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="section-head">
            <h6 className="section-title">Entry conditions</h6>
            <span className="section-count">
              {met}/{total} met
            </span>
          </div>
          <div className="rows">
            {stock.conds.map((c) => (
              <HoldRow key={c.id} copyText={c.text}>
                <button
                  className="check"
                  role="checkbox"
                  aria-checked={c.met}
                  aria-label={c.text}
                  onClick={() => journal.toggleCond(stock.id, c.id)}
                >
                  {c.met && <Check size={12} weight="bold" />}
                </button>
                <span className="row-text">{c.text}</span>
                <button
                  className="icon-btn"
                  aria-label={`Remove condition: ${c.text}`}
                  onClick={() => journal.removeCond(stock.id, c.id)}
                >
                  <X size={14} />
                </button>
              </HoldRow>
            ))}
          </div>
          <div className="add-row">
            <input
              className="input"
              placeholder="e.g. breaks 1,240 on volume"
              aria-label="New entry condition"
              value={newCond}
              onChange={(e) => setNewCond(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCond()}
            />
            <button className="btn btn-primary" onClick={addCond} aria-label="Add condition">
              <Plus size={14} weight="bold" />
            </button>
          </div>

          <h6 className="section-title" style={{ marginBottom: 8 }}>
            Fundamentals &amp; catalysts
          </h6>
          <div className="rows">
            {stock.facts.map((f) => (
              <HoldRow key={f.id} copyText={`${f.label}: ${f.value}`}>
                <span className="row-label">{f.label}</span>
                <span className="row-text">{f.value}</span>
                <button
                  className="icon-btn"
                  aria-label={`Remove ${f.label}`}
                  onClick={() => journal.removeFact(stock.id, f.id)}
                >
                  <X size={14} />
                </button>
              </HoldRow>
            ))}
          </div>
          <div className="add-row">
            <input
              className="input field-label"
              placeholder="Factor"
              aria-label="Factor"
              value={factLabel}
              onChange={(e) => setFactLabel(e.target.value)}
            />
            <input
              className="input"
              placeholder="Value or note"
              aria-label="Value or note"
              value={factValue}
              onChange={(e) => setFactValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFact()}
            />
            <button className="btn btn-primary" onClick={addFact} aria-label="Add factor">
              <Plus size={14} weight="bold" />
            </button>
          </div>

          <h6 className="section-title" style={{ marginBottom: 8 }}>
            Free note
          </h6>
          <textarea
            className="input"
            style={{ minHeight: 76 }}
            placeholder="Thesis, risk, what would invalidate it…"
            aria-label="Free note"
            value={stock.note}
            onChange={(e) => journal.setNote(stock.id, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
