import { useEffect, useState } from "react";
import { go, useRoute } from "./router";
import { useJournal } from "./store";
import NewTicker from "./screens/NewTicker";
import TickerDetail from "./screens/TickerDetail";
import Watchlist from "./screens/Watchlist";
import { SORTS, type Sort, type Status } from "./types";

type Filter = "All" | Status;

export default function App() {
  const journal = useJournal();
  const route = useRoute();
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("Readiness");

  const missing = route.name === "detail" && !journal.stocks.some((s) => s.id === route.id);

  // A bookmarked or stale #/t/<id> — send it back to the list rather than
  // rendering an empty detail screen.
  useEffect(() => {
    if (missing) go.list();
  }, [missing]);

  if (route.name === "new") {
    return (
      <main className="app">
        <NewTicker
          onSave={(s) => {
            journal.add(s);
            setFilter("All");
          }}
        />
      </main>
    );
  }

  if (route.name === "detail") {
    const stock = journal.stocks.find((s) => s.id === route.id);
    if (!stock) return <main className="app" />;
    return (
      <main className="app">
        <TickerDetail stock={stock} journal={journal} />
      </main>
    );
  }

  return (
    <main className="app">
      <Watchlist
        stocks={journal.stocks}
        filter={filter}
        sort={sort}
        onFilter={setFilter}
        onCycleSort={() => setSort(SORTS[(SORTS.indexOf(sort) + 1) % SORTS.length])}
      />
    </main>
  );
}
