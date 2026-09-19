import { uid, type Stock } from "./types";

/** What a first-time visitor sees — the same four tickers as the design. */
export const seedStocks = (): Stock[] => [
  {
    id: uid(),
    ticker: "NVDA",
    name: "NVIDIA Corp",
    market: "US",
    price: 184.2,
    change: 2.41,
    status: "Watching",
    conds: [
      { id: uid(), text: "Holds 176 support on retest", met: true },
      { id: uid(), text: "RSI(14) back above 50", met: true },
      { id: uid(), text: "MACD cross on daily", met: false },
      { id: uid(), text: "Breaks 190 resistance with volume", met: false },
    ],
    facts: [
      { id: uid(), label: "Catalyst", value: "GTC keynote, March" },
      { id: uid(), label: "News", value: "Hyperscaler capex guidance raised" },
      { id: uid(), label: "My factor", value: "Supply chain checks positive" },
    ],
    note: "Size at 1/3 first. Invalidated below 168 weekly close.",
  },
  {
    id: uid(),
    ticker: "ADVANC",
    name: "Advanced Info Service",
    market: "SET",
    price: 276,
    change: -0.72,
    status: "Holding",
    conds: [
      { id: uid(), text: "Above 270 support", met: true },
      { id: uid(), text: "Dividend announcement confirmed", met: true },
      { id: uid(), text: "Volume above 20d average", met: true },
    ],
    facts: [{ id: uid(), label: "Catalyst", value: "Ex-div 14 Apr" }],
    note: "Core holding. Add only on 262 retest.",
  },
  {
    id: uid(),
    ticker: "BTC",
    name: "Bitcoin",
    market: "Crypto",
    price: 71400,
    change: 4.18,
    status: "Ready",
    conds: [
      { id: uid(), text: "Reclaims 70k resistance", met: true },
      { id: uid(), text: "Daily close above 200MA", met: true },
      { id: uid(), text: "Funding rate not overheated", met: false },
    ],
    facts: [{ id: uid(), label: "News", value: "ETF net inflow 4 days running" }],
    note: "",
  },
  {
    id: uid(),
    ticker: "DELTA",
    name: "Delta Electronics (TH)",
    market: "SET",
    price: 118.5,
    change: -1.94,
    status: "Watching",
    conds: [
      { id: uid(), text: "Base above 112", met: false },
      { id: uid(), text: "MACD histogram turns up", met: false },
    ],
    facts: [{ id: uid(), label: "Risk", value: "Valuation rich vs sector" }],
    note: "",
  },
];
