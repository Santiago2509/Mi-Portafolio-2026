"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { workProcess, quote, timeline } from "@/data/content";

export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".process-list", start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((el) => {
        gsap.from(el, {
          x: -30,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });
      gsap.from(".tl-item", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".tl-list", start: "top 80%" },
      });
      gsap.fromTo(
        ".quote-card",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.3,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ".quote-card", start: "top 80%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-coal px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-3 lg:gap-12">
        {/* Process */}
        <div className="lg:col-span-1">
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-blood">
            <span className="h-px w-10 bg-blood" /> 04 · Proceso
          </p>
          <h2 className="font-display text-5xl uppercase leading-[0.9] md:text-6xl">Cómo trabajo</h2>
          <ol className="process-list relative mt-10 space-y-8 pl-14">
            <span className="absolute left-[19px] top-2 h-[calc(100%-16px)] w-px bg-bone/10" />
            <span className="process-line absolute left-[19px] top-2 h-[calc(100%-16px)] w-px origin-top bg-blood" />
            {workProcess.map((p, i) => (
              <li key={p.title} className="process-step relative">
                <span className="absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-blood bg-coal font-display text-sm text-blood">
                  0{i + 1}
                </span>
                <h3 className="font-display text-xl uppercase tracking-wide text-bone">{p.title}</h3>
                <p className="mt-1 text-sm text-bone/55">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-1">
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-blood">
            <span className="h-px w-10 bg-blood" /> 05 · Trayectoria
          </p>
          <h2 className="font-display text-5xl uppercase leading-[0.9] md:text-6xl">
            Siempre <span className="font-serif normal-case italic text-blood">en movimiento</span>
          </h2>
          <ul className="tl-list mt-10 divide-y divide-bone/10 border-y border-bone/10">
            {timeline.map((t) => (
              <li key={t.title} className="tl-item group flex items-start justify-between gap-4 py-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-mute">{t.period}</p>
                  <h3 className="mt-2 font-display text-2xl uppercase text-bone transition-colors group-hover:text-blood">
                    {t.title}
                  </h3>
                  <p className="text-sm text-bone/55">{t.place}</p>
                </div>
                {t.now && (
                  <span className="mt-1 rounded-full bg-blood px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-bone">
                    Ahora
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Quote */}
        <div className="quote-card relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-gradient-to-br from-blood via-[#a00400] to-wine p-8 md:p-10 lg:col-span-1">
          <div className="absolute -right-10 -top-16 font-serif text-[18rem] leading-none text-ink/20">“</div>
          <span className="font-serif text-6xl leading-none text-bone">“</span>
          <p className="relative font-serif text-3xl leading-tight text-bone md:text-4xl">{quote.text}</p>
          <div className="relative">
            <p className="font-script text-6xl text-bone">{quote.signature}</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-bone/80">Creemos algo grande juntos ✦</p>
          </div>
        </div>
      </div>
    </section>
  );
}
