import { ArrowsDownUp, Plus } from "@phosphor-icons/react";
import { go } from "../router";
import {
  fmtChange,
  fmtPrice,
  readiness,
  SORTS,
  STATUSES,
  type Sort,
  type Status,
  type Stock,
} from "../types";

type Filter = "All" | Status;

interface Props {
  stocks: Stock[];
  filter: Filter;
  sort: Sort;
  onFilter: (f: Filter) => void;
  onCycleSort: () => void;
}

function order(a: Stock, b: Stock, sort: Sort) {
  if (sort === "Symbol") return a.ticker.localeCompare(b.ticker);
  if (sort === "Change") return b.change - a.change;
  const ra = readiness(a);
  const rb = readiness(b);
  return rb.pct - ra.pct || rb.met - ra.met;
}

export default function Watchlist({ stocks, filter, sort, onFilter, onCycleSort }: Props) {
  const shown = stocks
    .filter((s) => filter === "All" || s.status === filter)
    .sort((a, b) => order(a, b, sort));

  const filters: Filter[] = ["All", ...STATUSES];

  return (
    <div className="screen">
      <header className="list-head">
        <div style={{ flex: 1 }}>
          <div className="kicker">Entry journal</div>
          <h1 className="title">Watchlist</h1>
        </div>
        <button
          className="btn btn-secondary"
          style={{ height: 34, fontSize: 12 }}
          onClick={onCycleSort}
          title={`Sort by ${SORTS[(SORTS.indexOf(sort) + 1) % SORTS.length]}`}
        >
          <ArrowsDownUp size={14} weight="bold" />
          {sort}
        </button>
      </header>

      <div className="chiprow" role="group" aria-label="Filter by status">
        {filters.map((label) => (
          <button
            key={label}
            className="pick"
            aria-pressed={filter === label}
            onClick={() => onFilter(label)}
          >
            {label} {label === "All" ? stocks.length : stocks.filter((s) => s.status === label).length}
          </button>
        ))}
      </div>

      <div className="scroll">
        <div className="cards">
          {shown.map((s) => {
            const { met, total, pct } = readiness(s);
            return (
              <button key={s.id} className="tcard" onClick={() => go.detail(s.id)}>
                <div className="tcard-top">
                  <div className="tcard-id">
                    <div className="symbol-row">
                      <span className="symbol">{s.ticker}</span>
                      <span className="market">{s.market}</span>
                    </div>
                    <div className="coname">{s.name}</div>
                  </div>
                  <div className="price-col">
                    <div className="price">{fmtPrice(s.price)}</div>
                    <div className={"chg " + (s.change >= 0 ? "up" : "down")}>
                      {fmtChange(s.change)}
                    </div>
                  </div>
                </div>

                <div className="meter-row">
                  <div className="meter">
                    <span style={{ width: pct + "%" }} />
                  </div>
                  <span className="meter-label">
                    {met}/{total} rules
                  </span>
                  <span className="tag tag-neutral">{s.status}</span>
                </div>

                <div className="preview">
                  {s.conds.slice(0, 3).map((c) => (
                    <span key={c.id} className={"pchip" + (c.met ? " met" : "")}>
                      {c.met ? "✓ " : ""}
                      {c.text}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}

          {shown.length === 0 && <div className="empty">No tickers in this stage yet.</div>}
        </div>
      </div>

      <div className="bottom-bar">
        <button className="btn btn-primary btn-block" onClick={go.new}>
          <Plus size={16} weight="bold" />
          Add ticker
        </button>
      </div>
    </div>
  );
}
