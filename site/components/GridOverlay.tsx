"use client";

import { useCallback, useEffect, useState } from "react";

export default function GridOverlay() {
  const [visible, setVisible] = useState(false);

  const toggle = useCallback(() => {
    setVisible((v) => {
      const next = !v;
      try {
        window.localStorage.setItem("grid-overlay", next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" && window.localStorage.getItem("grid-overlay") === "1";
    if (saved) setVisible(true);

    function onKey(e: KeyboardEvent) {
      if ((e.key === "g" || e.key === "G") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-4 right-4 z-[60] px-3 py-1.5 text-xs uppercase tracking-widest bg-white/90 hover:bg-white shadow border border-zinc-200"
        aria-pressed={visible}
        title="Toggle grid overlay (Cmd/Ctrl + G)"
      >
        Grid
      </button>
      {visible ? (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="site-grid h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-fuchsia-500/10 outline outline-1 outline-fuchsia-600/30"
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}


