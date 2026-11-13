"use client";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/content";
import { scrollToId } from "./SmoothScroll";
import { holo } from "@/lib/holo";

const HoloPortrait = dynamic(() => import("./HoloPortrait"), { ssr: false });

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const reveal = useRef(0); // 0 = hologram, 1 = human (driven by scroll)
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const mode = useRef<HTMLSpanElement>(null);
  const [el, setEl] = useState<HTMLElement | null>(null);

  // Hidden initial state + pinned scroll transformation (created on mount so later sections measure correctly)
  useIsoLayoutEffect(() => {
    setEl(root.current);
    const ctx = gsap.context(() => {
      gsap.set(".hero-letter", { yPercent: 110 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 30 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              const r = gsap.utils.clamp(0, 1, self.progress / 0.6);
              reveal.current = r;
              holo.reveal = r; // the page-wide network bursts out at 1
              if (pct.current) pct.current.textContent = String(Math.round(r * 100)).padStart(3, "0");
              if (bar.current) bar.current.style.transform = `scaleX(${r})`;
              if (mode.current) mode.current.textContent = r >= 1 ? "Humano" : r > 0.01 ? "Mutando" : "Máquina";
            },
          },
        })
        .to(word.current, { yPercent: 18, opacity: 0.35, ease: "none" }, 0)
        .to(".hero-hint", { autoAlpha: 0, ease: "none", duration: 0.2 }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  // Entrance, in sync with the loader reveal
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(".hero-letter", { yPercent: 0, duration: 1.4, stagger: 0.05 }, 0.1)
        .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.7);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // Mouse parallax for the giant word (desktop)
  useEffect(() => {
    const node = root.current;
    if (!node || !window.matchMedia("(pointer: fine)").matches) return;
    const wx = gsap.quickTo(".hero-word-inner", "x", { duration: 1.6, ease: "power3" });
    const gx = gsap.quickTo(".hero-aura", "x", { duration: 2, ease: "power3" });
    const gy = gsap.quickTo(".hero-aura", "y", { duration: 2, ease: "power3" });
    const move = (e: PointerEvent) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      wx(nx * -40);
      gx(nx * 120);
      gy(ny * 80);
    };
    node.addEventListener("pointermove", move);
    return () => node.removeEventListener("pointermove", move);
  }, []);

  return (
    <section ref={root} id="inicio" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* Aura + halo arc + vignette */}
      <div className="hero-aura pointer-events-none absolute left-1/2 top-[52%] h-[95vmin] w-[95vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-[46%] h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-glow/25" />
      <div className="pointer-events-none absolute left-1/2 top-[46%] h-[96vmin] w-[96vmin] -translate-x-1/2 -translate-y-1/2 animate-[spin_90s_linear_infinite] rounded-full border border-dashed border-glow/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#07060b_88%)]" />

      {/* Giant word behind the portrait */}
      <div ref={word} className="absolute inset-x-0 top-[14%] md:top-[11%]">
        <div className="hero-word-inner flex justify-center overflow-hidden leading-[0.8]">
          {profile.heroWord.split("").map((l, i) => (
            <span
              key={i}
              className="hero-letter inline-block bg-gradient-to-b from-accent/70 via-accent/30 to-transparent bg-clip-text font-display text-[28vw] uppercase text-transparent md:text-[27.5vw]"
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Hologram → human portrait (WebGL) */}
      {el && <HoloPortrait ready={ready} revealRef={reveal} eventSource={el} />}

      {/* Legibility fade under the text */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />

      {/* Left column */}
      <div className="absolute bottom-8 left-5 z-10 max-w-[190px] md:bottom-14 md:left-10 md:max-w-[360px]">
        <p className="hero-fade font-script text-4xl text-bone md:text-5xl">Hola, soy</p>
        <h1 className="hero-fade mt-1 font-display text-4xl uppercase leading-[0.95] text-bone md:text-6xl">
          {profile.name}
          {profile.lastName && <br />}
          {profile.lastName}
        </h1>
        <p className="hero-fade mt-3 font-display text-lg uppercase tracking-wide text-glow md:text-2xl">
          {profile.role}
        </p>
        <p className="hero-fade mt-1 text-[10px] uppercase tracking-[0.2em] text-bone/50 md:text-[11px] md:tracking-[0.3em]">
          {profile.specialties.join(" · ")}
        </p>
        <p className="hero-fade mt-3 hidden text-sm leading-relaxed text-bone/60 md:block">{profile.tagline}</p>
        <button
          onClick={() => scrollToId("proyectos")}
          data-cursor="Ver"
          className="hero-fade group mt-6 hidden items-center gap-3 rounded-full bg-bone py-2 pl-6 pr-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-accent hover:text-bone md:inline-flex"
        >
          Ver mi trabajo
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-bone transition-transform duration-300 group-hover:rotate-45">
            ↗
          </span>
        </button>
      </div>

      {/* Right: identity panel (glass) */}
      <div className="hero-fade absolute bottom-8 right-4 z-10 w-[148px] rounded-2xl border border-bone/10 bg-bone/[0.04] p-3 backdrop-blur-md md:bottom-14 md:right-10 md:w-[260px] md:p-5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-bone/50">
          <span className="hidden md:inline">identidad.sys</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-glow" />
            <span ref={mode}>Máquina</span>
          </span>
        </div>
        <p className="mt-3 font-display text-3xl leading-none text-bone md:text-5xl">
          <span ref={pct} className="tabular-nums">000</span>
          <span className="text-glow">%</span>
          <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.25em] text-bone/50 md:ml-2 md:mt-0 md:inline md:align-middle">humano</span>
        </p>
        <span className="mt-3 block h-px w-full bg-bone/15">
          <span ref={bar} className="block h-px w-full origin-left scale-x-0 bg-glow shadow-[0_0_12px_2px_rgba(169,149,255,0.7)]" />
        </span>
        <p className="hero-hint mt-3 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-bone/45">
          Haz scroll para transformar
        </p>
      </div>

      {/* Top-right label */}
      <div className="absolute right-10 top-[72px] z-10 hidden text-[11px] uppercase tracking-[0.3em] text-bone/50 md:block">
        <span className="hero-fade inline-block">{profile.location} · 2026</span>
      </div>
    </section>
  );
}
