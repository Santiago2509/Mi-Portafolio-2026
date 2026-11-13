"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { profile, stats } from "@/data/content";
import { scrollToId } from "./SmoothScroll";

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);

  // Entrance once the loader finishes
  useEffect(() => {
    if (!ready || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-letter", { yPercent: 110, duration: 1.4, stagger: 0.05 })
        .from(photo.current, { y: 120, opacity: 0, scale: 1.08, duration: 1.6 }, 0.15)
        .from(".hero-fade", { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.6)
        .from(".hero-stat", { x: 40, opacity: 0, duration: 1, stagger: 0.1 }, 0.8);

      // Count-up for stats
      root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 2,
          delay: 0.9,
          ease: "power3.out",
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
        });
      });

      // Scroll: photo rises & scales, giant word sinks, everything fades
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        .to(photo.current, { yPercent: -12, scale: 1.12, ease: "none" }, 0)
        .to(word.current, { yPercent: 35, opacity: 0.2, ease: "none" }, 0)
        .to(".hero-side", { y: -80, opacity: 0, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // Mouse parallax (desktop)
  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const qx = gsap.quickTo(".hero-photo-inner", "x", { duration: 1.2, ease: "power3" });
    const qy = gsap.quickTo(".hero-photo-inner", "y", { duration: 1.2, ease: "power3" });
    const wx = gsap.quickTo(".hero-word-inner", "x", { duration: 1.6, ease: "power3" });
    const gx = gsap.quickTo(".hero-glow", "x", { duration: 2, ease: "power3" });
    const gy = gsap.quickTo(".hero-glow", "y", { duration: 2, ease: "power3" });
    const move = (e: PointerEvent) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      qx(nx * 24);
      qy(ny * 14);
      wx(nx * -40);
      gx(nx * 120);
      gy(ny * 80);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  const letters = profile.heroWord.split("");

  return (
    <section ref={root} id="inicio" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* Glow + vignette */}
      <div className="hero-glow pointer-events-none absolute left-1/2 top-[55%] h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood/35 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0a0a0a_85%)]" />

      {/* Giant word behind the photo */}
      <div ref={word} className="absolute inset-x-0 top-[14%] md:top-[11%]">
        <div className="hero-word-inner flex justify-center overflow-hidden leading-[0.8]">
          {letters.map((l, i) => (
            <span
              key={i}
              className="hero-letter inline-block bg-gradient-to-b from-flame via-blood to-wine bg-clip-text font-display text-[28vw] uppercase text-transparent md:text-[27.5vw]"
            >
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Photo */}
      <div
        ref={photo}
        className="absolute bottom-0 left-1/2 h-[78%] w-[min(92vw,620px)] -translate-x-1/2 md:h-[92%] md:w-[min(46vw,720px)]"
      >
        <div className="hero-photo-inner relative h-full w-full">
          <Image
            src="/images/hero-portrait.webp"
            alt={`${profile.name} con gafas de sol, retrato en blanco y negro con luz roja`}
            fill
            priority
            sizes="(max-width: 768px) 92vw, 46vw"
            className="object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]"
          />
        </div>
      </div>

      {/* Outlined word in front, very subtle */}
      <div className="pointer-events-none absolute inset-x-0 top-[14%] flex justify-center leading-[0.8] text-bone/10 md:top-[11%]">
        <span className="text-stroke font-display text-[28vw] uppercase md:text-[27.5vw]">{profile.heroWord}</span>
      </div>

      {/* Left column */}
      <div className="hero-side absolute bottom-10 left-5 z-10 max-w-[300px] md:bottom-16 md:left-10 md:max-w-[340px]">
        <p className="hero-fade font-script text-4xl text-bone md:text-5xl">Hola, soy</p>
        <h2 className="hero-fade mt-1 font-display text-4xl uppercase leading-[0.95] text-bone md:text-6xl">
          {profile.name}
          {profile.lastName && <br />}
          {profile.lastName}
        </h2>
        <p className="hero-fade mt-3 font-display text-lg uppercase tracking-wide text-blood md:text-2xl">
          {profile.role}
        </p>
        <p className="hero-fade mt-1 text-[11px] uppercase tracking-[0.3em] text-bone/50">
          {profile.specialties.join(" · ")}
        </p>
        <p className="hero-fade mt-3 hidden text-sm leading-relaxed text-bone/60 md:block">{profile.tagline}</p>
        <button
          onClick={() => scrollToId("proyectos")}
          data-cursor="Ver"
          className="hero-fade group mt-6 hidden items-center gap-3 rounded-full bg-bone py-2 pl-6 pr-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-blood hover:text-bone md:inline-flex"
        >
          Ver mi trabajo
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-bone transition-transform duration-300 group-hover:rotate-45">
            ↗
          </span>
        </button>
      </div>

      {/* Right column: stats */}
      <div className="hero-side absolute bottom-16 right-10 z-10 hidden w-56 flex-col md:flex">
        {stats.map((s) => (
          <div key={s.label} className="hero-stat flex items-center gap-4 border-b border-bone/10 py-4 last:border-0">
            <span className="font-display text-5xl text-blood">
              <span data-count={s.value}>0</span>
              {s.suffix}
            </span>
            <span className="text-[11px] uppercase leading-tight tracking-[0.2em] text-bone/60">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Top labels */}
      <div className="hero-side absolute inset-x-0 top-[72px] z-10 hidden justify-end px-10 text-[11px] uppercase tracking-[0.3em] text-bone/50 md:flex">
        <span className="hero-fade">{profile.location} · 2026</span>
      </div>

      {/* Scroll hint */}
      <div className="hero-side absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-bone/50">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-bone/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_1.6s_ease-in-out_infinite] bg-blood" />
        </span>
      </div>
      <style>{`@keyframes scrollhint{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
