"use client";
import { useEffect, useRef, useState } from "react";

/** Red dot + ring cursor. Elements with data-cursor="Texto" show a label. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = (e.target as HTMLElement)?.closest?.("a, button, [data-cursor]") as HTMLElement | null;
      setHover(!!t);
      setLabel(t?.dataset.cursor ?? "");
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-flame" />
      </div>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[99]">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-out ${
            label
              ? "h-20 w-20 border-blood bg-blood"
              : hover
                ? "h-14 w-14 border-flame bg-flame/10"
                : "h-9 w-9 border-bone/40"
          }`}
        >
          {label && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-bone">{label}</span>
          )}
        </div>
      </div>
    </>
  );
}
