"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/content";

/** Intro: counter 0→100, then a red circle expands and reveals the site. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const circle = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: onDone });

    // Wait for the hero image so the reveal shows a finished frame
    const img = new Image();
    img.src = "/images/hero.webp";
    const imgReady = img.decode().catch(() => undefined);

    tl.to(counter, {
      v: 100,
      duration: reduce ? 0.3 : 2.1,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(counter.v)),
    })
      .add(() => {
        tl.pause();
        imgReady.then(() => tl.resume());
      })
      .to(".loader-text", { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.05 })
      .fromTo(
        circle.current,
        { scale: 0 },
        { scale: 1, duration: 1.0, ease: "expo.inOut" },
        "-=0.2",
      )
      .to(root.current, { clipPath: "circle(0% at 50% 50%)", duration: 0.9, ease: "expo.inOut" }, "-=0.15");

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
      style={{ clipPath: "circle(150% at 50% 50%)" }}
    >
      <div
        ref={circle}
        className="absolute h-[250vmax] w-[250vmax] rounded-full bg-blood"
        style={{ transform: "scale(0)" }}
      />
      <div className="relative flex flex-col items-center gap-2 overflow-hidden">
        <div className="overflow-hidden">
          <p className="loader-text font-script text-3xl text-flame">Hola, soy</p>
        </div>
        <div className="overflow-hidden">
          <h1 className="loader-text font-display text-6xl uppercase tracking-tight text-bone md:text-8xl">
            {profile.heroWord}
          </h1>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 overflow-hidden">
        <span className="loader-text block font-display text-7xl text-bone/90 tabular-nums md:text-9xl">
          {count}
          <span className="text-blood">%</span>
        </span>
      </div>
      <div className="absolute bottom-10 left-8 overflow-hidden">
        <span className="loader-text block text-xs uppercase tracking-[0.3em] text-mute">Portafolio · 2026</span>
      </div>
    </div>
  );
}
