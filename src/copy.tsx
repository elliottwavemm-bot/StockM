import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Copy = (text: string, label?: string) => void;

const CopyContext = createContext<Copy>(() => {});

export const useCopy = () => useContext(CopyContext);

/** Both paths need the transient user activation from the press that triggered
 *  them, which is why the hold fires well inside the activation window. */
async function toClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* denied or unavailable — fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.contentEditable = "true";
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export function CopyProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ text: string; ok: boolean; n: number } | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const copy = useCallback<Copy>((text, label) => {
    void toClipboard(text).then((ok) =>
      setToast({
        text: ok ? (label ? `Copied ${label}` : "Copied") : "Could not copy",
        ok,
        n: ++seq.current,
      }),
    );
  }, []);

  return (
    <CopyContext.Provider value={copy}>
      {children}
      {toast && (
        <div key={toast.n} className={"toast" + (toast.ok ? "" : " toast-bad")} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}
    </CopyContext.Provider>
  );
}
