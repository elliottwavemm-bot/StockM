import { useCallback, useRef } from "react";

const HOLD_MS = 450;
const SLOP_PX = 10;

/** Press-and-hold on an element to fire `onLongPress`, without also firing the
 *  tap that a release normally produces. Presses that start on a nested button
 *  are left alone, so the checkbox and the remove icon still behave normally. */
export function useLongPress(onLongPress: () => void) {
  const timer = useRef<number | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);

  const cancel = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    origin.current = null;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      const inner = target.closest("button");
      if (inner && inner !== e.currentTarget) return;

      cancel();
      fired.current = false;
      origin.current = { x: e.clientX, y: e.clientY };
      timer.current = window.setTimeout(() => {
        timer.current = null;
        fired.current = true;
        onLongPress();
      }, HOLD_MS);
    },
    [cancel, onLongPress],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const o = origin.current;
      if (!o) return;
      // A scroll starts as a press; let any real movement call it off.
      if (Math.hypot(e.clientX - o.x, e.clientY - o.y) > SLOP_PX) cancel();
    },
    [cancel],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: cancel,
    onPointerCancel: cancel,
    onPointerLeave: cancel,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onClickCapture: (e: React.MouseEvent) => {
      if (!fired.current) return;
      fired.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
  };
}
