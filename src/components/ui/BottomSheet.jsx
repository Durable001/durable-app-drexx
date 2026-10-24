import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const EXIT_MS = 280; // keep in sync with the .bs-sheet transition
const DISMISS_DRAG = 90; // px of downward drag that closes the sheet

/**
 * Generic bottom sheet: slides up over a dimmed backdrop, closes on backdrop tap, Esc, the X button or a swipe down
 * on the handle. Rendered in a portal so no parent (sticky / overflow / transform) can clip or reposition it.
 * Render a heading with `id={titleId}` inside children, where `titleId` comes from the render-prop form:
 *   <BottomSheet open onClose>{titleId => <h2 id={titleId}>...</h2>}</BottomSheet>
 */
export default function BottomSheet({ open, onClose, children }) {
  const [mounted, setMounted] = useState(false); // in the DOM
  const [shown, setShown] = useState(false); // slid in (drives the CSS transition)
  const sheetRef = useRef(null);
  const drag = useRef({ y0: 0, dy: 0, active: false });
  const titleId = useId();

  // mount -> next frame -> slide in; slide out -> unmount after the transition
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  // Esc to close, lock page scroll, move focus into the sheet and give it back afterwards
  useEffect(() => {
    if (!mounted) return;
    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = e => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    sheetRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow || "";
      window.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [mounted, onClose]);

  const onPointerDown = e => {
    drag.current = { y0: e.clientY, dy: 0, active: true };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };
  const onPointerMove = e => {
    const d = drag.current;
    if (!d.active || !sheetRef.current) return;
    d.dy = Math.max(0, e.clientY - d.y0); // straight to the DOM: no re-render while dragging
    sheetRef.current.style.transform = `translateY(${d.dy}px)`;
  };
  const onPointerEnd = () => {
    const d = drag.current;
    const el = sheetRef.current;
    if (!d.active || !el) return;
    d.active = false;
    el.style.transition = "";
    if (d.dy > DISMISS_DRAG) {
      el.style.transform = "translateY(100%)"; // finish the slide-out from where the finger left it
      onClose?.();
    } else {
      el.style.transform = ""; // spring back
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className={`bs-root${shown ? " is-open" : ""}`}>
      <div className="bs-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={sheetRef} className="bs-sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div
          className="bs-grab"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}>
          <span className="bs-handle" aria-hidden="true" />
        </div>
        <button type="button" className="ui-icon-btn bs-close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>
        {typeof children === "function" ? children(titleId) : children}
      </div>
    </div>,
    document.body
  );
}
