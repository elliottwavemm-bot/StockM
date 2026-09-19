import { useEffect, useState } from "react";

export type Route =
  | { name: "list" }
  | { name: "detail"; id: string }
  | { name: "new" };

function parse(hash: string): Route {
  const path = hash.replace(/^#\/?/, "");
  if (path === "new") return { name: "new" };
  const m = /^t\/(.+)$/.exec(path);
  if (m) return { name: "detail", id: decodeURIComponent(m[1]) };
  return { name: "list" };
}

/** Hash routing, so the browser's back button walks the screens. */
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));
  useEffect(() => {
    const on = () => setRoute(parse(location.hash));
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return route;
}

export const go = {
  list: () => {
    location.hash = "#/";
  },
  detail: (id: string) => {
    location.hash = "#/t/" + encodeURIComponent(id);
  },
  new: () => {
    location.hash = "#/new";
  },
  back: () => history.back(),
};
