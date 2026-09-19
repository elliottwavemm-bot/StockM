import { useState } from "react";
import { CaretLeft } from "@phosphor-icons/react";
import { go } from "../router";
import { MARKETS, uid, type Market, type Stock } from "../types";

interface Props {
  onSave: (s: Stock) => void;
}

export default function NewTicker({ onSave }: Props) {
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [market, setMarket] = useState<Market>("US");
  const [price, setPrice] = useState("");
  const [cond, setCond] = useState("");

  const save = () => {
    const symbol = ticker.trim().toUpperCase();
    if (!symbol) return;
    const id = uid();
    onSave({
      id,
      ticker: symbol,
      name: name.trim() || "—",
      market,
      price: parseFloat(price.replace(/,/g, "")) || 0,
      change: 0,
      status: "Watching",
      conds: cond.trim() ? [{ id: uid(), text: cond.trim(), met: false }] : [],
      facts: [],
      note: "",
    });
    go.detail(id);
  };

  return (
    <div className="screen">
      <div className="topbar">
        <button className="btn btn-ghost" onClick={go.back}>
          <CaretLeft size={14} weight="bold" />
          Cancel
        </button>
      </div>

      <div className="scroll">
        <form
          className="pane"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <h1 className="form-title">New ticker</h1>

          <div className="field form-field">
            <label htmlFor="f-symbol">Symbol</label>
            <input
              id="f-symbol"
              className="input"
              placeholder="NVDA"
              autoFocus
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
          </div>

          <div className="field form-field">
            <label htmlFor="f-name">Company / asset name</label>
            <input
              id="f-name"
              className="input"
              placeholder="NVIDIA Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field form-field">
            <label>Market</label>
            <div className="pick-row" role="group" aria-label="Market">
              {MARKETS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className="pick pick-wide"
                  style={{ padding: "8px 4px", fontSize: 12 }}
                  aria-pressed={market === m}
                  onClick={() => setMarket(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="field form-field">
            <label htmlFor="f-price">Reference price</label>
            <input
              id="f-price"
              className="input"
              inputMode="decimal"
              placeholder="1,240"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="field form-field">
            <label htmlFor="f-cond">First entry condition</label>
            <input
              id="f-cond"
              className="input"
              placeholder="RSI back above 50"
              value={cond}
              onChange={(e) => setCond(e.target.value)}
            />
          </div>

          <div className="save-row">
            <button className="btn btn-primary btn-block" type="submit" disabled={!ticker.trim()}>
              Save to watchlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
