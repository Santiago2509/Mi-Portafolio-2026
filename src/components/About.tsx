"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { about, profile } from "@/data/content";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Photo: clip reveal + slow parallax
      gsap.fromTo(
        ".about-frame",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: ".about-frame", start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".about-img",
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      // Word-by-word light up
      gsap.fromTo(
        ".about-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".about-statement", start: "top 75%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.from(".about-fact", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-facts", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const highlight = new Set(["detalles,", "productos", "reales.", "funcione."]);

  return (
    <section ref={root} id="sobre-mi" className="relative bg-ink px-5 pb-24 pt-32 md:px-10 md:pb-40 md:pt-48">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
        {/* Photo */}
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -left-4 -top-4 h-full w-full border border-blood/60 md:-left-6 md:-top-6" />
          <div className="about-frame relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-ash via-wine/70 to-blood">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,42,31,0.35),transparent_60%)]" />
            <span className="absolute left-4 top-3 font-display text-[22vw] leading-none text-ink/25 md:text-[9rem]">
              REAL
            </span>
            <div className="about-img absolute inset-0">
              <Image
                src="/images/natural.webp"
                alt={`${profile.name}, foto natural sin gafas`}
                fill
                sizes="(max-width: 768px) 90vw, 460px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <p className="absolute -bottom-8 right-0 font-script text-4xl text-flame md:-right-8 md:text-5xl">
            sin filtros
          </p>
        </div>

        {/* Text */}
        <div>
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-blood">
            <span className="h-px w-10 bg-blood" /> 01 · {about.kicker}
          </p>
          <p className="about-statement font-display text-[2.1rem] uppercase leading-[1.05] md:text-6xl">
            {about.statement.split(" ").map((w, i) => (
              <span key={i} className={`about-word ${highlight.has(w) ? "text-blood" : "text-bone"}`}>
                {w}{" "}
              </span>
            ))}
          </p>
          <div className="about-facts mt-14 grid grid-cols-1 gap-6 border-t border-bone/10 pt-8 sm:grid-cols-3">
            {about.facts.map((f) => (
              <div key={f.k} className="about-fact">
                <p className="text-[11px] uppercase tracking-[0.25em] text-mute">{f.k}</p>
                <p className="mt-2 font-serif text-2xl italic text-bone">{f.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
