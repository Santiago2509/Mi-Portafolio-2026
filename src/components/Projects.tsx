"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/data/content";

function Visual({ p, i }: { p: Project; i: number }) {
  if (p.image) {
    const host = p.href ? new URL(p.href).host : "";
    return (
      <div className="absolute inset-0 flex flex-col">
        {/* browser frame */}
        <div className="flex h-8 shrink-0 items-center gap-2 border-b border-bone/10 bg-[#121016] px-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate rounded-md bg-bone/[0.06] px-3 py-0.5 text-[12px] text-bone/70">{host}</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <Image
            src={p.image}
            alt={`Captura del sitio ${p.title}`}
            fill
            sizes="(max-width:768px) 92vw, 44vw"
            className="project-shot object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `radial-gradient(circle at 70% 30%, ${p.accent}, #000000 70%)` }}>
      <span className="absolute -bottom-6 -left-2 font-display text-[9rem] uppercase leading-none text-bone/90">{p.title}</span>
      <span className="absolute right-5 top-4 font-serif text-xl italic text-bone/80">{i + 1}</span>
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${dist()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        // cards rise and tilt into place as they slide in
        gsap.fromTo(
          card,
          { y: 70, rotate: 2.5, opacity: 0.35 },
          { y: 0, rotate: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 45%", scrub: true } },
        );
      });
    });
    mm.add("(max-width: 767px)", () => {
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 85%" } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="proyectos" className="relative overflow-hidden bg-coal md:h-screen">
      <div ref={track} className="flex flex-col gap-16 px-5 py-24 md:h-full md:w-max md:flex-row md:items-center md:gap-10 md:px-10 md:py-0">
        {/* Intro panel */}
        <div className="flex shrink-0 flex-col justify-center md:w-[38vw] md:pr-10">
          <p className="mb-6 flex items-center gap-3 text-[13px] uppercase tracking-[0.3em] text-glow">
            Proyectos
          </p>
          <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-[7vw]">
            Proyectos
            <br />
            <span className="font-serif normal-case italic text-glow">en vivo</span>
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-bone/78">
            Proyectos reales, en producción y usados por negocios. Desliza para ver cada uno.
          </p>
          <span className="mt-10 hidden items-center gap-3 text-[13px] uppercase tracking-[0.3em] text-bone/72 md:flex">
            Scroll <span className="inline-block h-px w-16 bg-bone/30" /> →
          </span>
        </div>

        {projects.map((p, i) => (
          <article key={p.title} className="project-card group shrink-0 md:w-[46vw] lg:w-[40vw]">
            <a
              href={p.href ?? "#"}
              target="_blank"
              rel="noreferrer"
              data-cursor="Abrir"
              className="relative block aspect-[16/10] overflow-hidden rounded-xl border border-bone/10 bg-ash shadow-[0_30px_80px_-30px_rgba(109,77,255,0.45)] transition-colors duration-500 hover:border-glow/50"
            >
              <div className="project-visual absolute inset-0">
                <Visual p={p} i={i} />
              </div>
            </a>
            <div className="mt-5 flex items-start gap-5">
              <span className="font-display text-4xl leading-none text-glow">0{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-3xl uppercase leading-none tracking-wide">{p.title}</h3>
                  <p className="text-[13px] uppercase tracking-[0.2em] text-mute">
                    {p.category} · {p.year}
                  </p>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-bone/82">{p.description}</p>
                <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[14px] text-bone/90">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/25 text-[10px] text-glow">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-bone/15 px-3 py-1 text-[12px] uppercase tracking-widest text-bone/82">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] font-semibold uppercase tracking-[0.15em] text-bone/85 transition-colors hover:text-glow"
                    >
                      Código ↗
                    </a>
                  )}
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/btn inline-flex items-center gap-2 rounded-full bg-bone py-1.5 pl-4 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-accent hover:text-bone"
                    >
                      Ver sitio
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-bone transition-transform duration-300 group-hover/btn:rotate-45">↗</span>
                    </a>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
        <div className="hidden w-[10vw] shrink-0 md:block" />
      </div>
    </section>
  );
}
