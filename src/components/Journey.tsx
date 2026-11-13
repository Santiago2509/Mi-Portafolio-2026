"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { stats, timeline } from "@/data/content";

/** Experiencia: cifras + trayectoria profesional y académica. */
export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Count-up when the numbers enter the viewport
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const o = { v: 0 };
        gsap.to(o, {
          v: Number(el.dataset.count),
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.from(".stat", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".stats", start: "top 85%" },
      });
      // Timeline line grows with scroll, items slide in
      gsap.fromTo(
        ".tl-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".tl-list", start: "top 70%", end: "bottom 65%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el) => {
        gsap.from(el, {
          x: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="experiencia" className="relative bg-coal px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* Left: title + numbers (sticky on desktop) */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-glow">
            <span className="h-px w-10 bg-accent" /> 02 · Experiencia
          </p>
          <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-8xl">
            Mi <span className="font-serif normal-case italic text-glow">recorrido</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/60">
            Lo que he estudiado, dónde he trabajado y lo que he construido hasta hoy.
          </p>
          <div className="stats mt-12 grid grid-cols-3 gap-4 border-t border-bone/10 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <p className="font-display text-5xl text-bone md:text-7xl">
                  <span data-count={s.value}>0</span>
                  <span className="text-glow">{s.suffix}</span>
                </p>
                <p className="mt-2 text-[10px] uppercase leading-tight tracking-[0.2em] text-mute md:text-[11px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: timeline */}
        <ol className="tl-list relative space-y-6 pl-8 md:pl-12">
          <span className="absolute left-[5px] top-3 h-[calc(100%-24px)] w-px bg-bone/10" />
          <span className="tl-line absolute left-[5px] top-3 h-[calc(100%-24px)] w-px origin-top bg-glow shadow-[0_0_10px_1px_rgba(169,149,255,0.7)]" />
          {timeline.map((t) => (
            <li key={t.title} className="tl-item group relative">
              <span
                className={`absolute -left-8 top-8 h-[11px] w-[11px] rounded-full border md:-left-12 ${
                  t.now ? "border-glow bg-glow shadow-[0_0_14px_3px_rgba(169,149,255,0.8)]" : "border-bone/40 bg-coal"
                }`}
              />
              <div className="rounded-2xl border border-bone/10 bg-bone/[0.03] p-6 backdrop-blur-sm transition-colors duration-500 group-hover:border-accent/60 group-hover:bg-accent/[0.07] md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-mute">{t.period}</p>
                  {t.now && (
                    <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-bone">
                      Ahora
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-3xl uppercase leading-none text-bone md:text-4xl">{t.title}</h3>
                <p className="mt-1 font-serif text-xl italic text-glow">{t.place}</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone/60">{t.text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-bone/15 px-3 py-1 text-[10px] uppercase tracking-widest text-bone/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
