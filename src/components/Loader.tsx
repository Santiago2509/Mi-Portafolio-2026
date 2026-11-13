"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/content";

const BOOT = [
  "inicializando sistema",
  "cargando módulos: código · diseño · 3d",
  "escaneando identidad",
  `identidad confirmada: ${profile.name.toLowerCase()}`,
];

/**
 * Boot sequence: counter 0→100 with terminal lines, then the screen opens.
 * onReveal fires when the opening starts (the hero animates in at the same time),
 * onDone when the loader can be unmounted.
 */
export default function Loader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: onDone });

    // Wait for the portrait so the reveal never shows a half-loaded hero
    const img = new Image();
    img.src = "/images/hero-holo.webp";
    const imgReady = Promise.all([img.decode().catch(() => undefined), document.fonts.ready]);

    tl.to(counter, {
      v: 100,
      duration: reduce ? 0.3 : 2.2,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.v)),
    })
      .add(() => {
        tl.pause();
        imgReady.then(() => tl.resume());
      })
      .to(".loader-item", { yPercent: -120, opacity: 0, duration: 0.5, ease: "power3.in", stagger: 0.04 })
      .add(onReveal)
      .to(root.current, { clipPath: "circle(0% at 50% 50%)", duration: 1.0, ease: "expo.inOut" });

    return () => {
      tl.kill();
    };
  }, [onReveal, onDone]);

  const line = Math.min(BOOT.length - 1, Math.floor((count / 100) * BOOT.length));

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
      style={{ clipPath: "circle(150% at 50% 50%)" }}
    >
      <div className="pointer-events-none absolute h-[60vmin] w-[60vmin] rounded-full bg-accent/25 blur-[120px]" />
      <div className="relative w-[min(86vw,460px)]">
        <div className="loader-item flex items-end justify-between">
          <span className="font-display text-7xl leading-none text-bone tabular-nums md:text-8xl">
            {String(count).padStart(3, "0")}
            <span className="text-glow">%</span>
          </span>
          <span className="pb-2 text-[10px] uppercase tracking-[0.3em] text-mute">Portafolio · 2026</span>
        </div>
        <span className="loader-item mt-4 block h-px w-full bg-bone/15">
          <span
            className="block h-px origin-left bg-glow shadow-[0_0_12px_2px_rgba(169,149,255,0.7)]"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </span>
        <div className="loader-item mt-4 h-[72px] font-mono text-[11px] leading-[18px] text-bone/60">
          {BOOT.slice(0, line + 1).map((t, i) => (
            <p key={t} className={i === line ? "text-glow" : ""}>
              <span className="text-bone/30">&gt;</span> {t}
              {i === line ? <span className="animate-pulse">_</span> : " ✓"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
