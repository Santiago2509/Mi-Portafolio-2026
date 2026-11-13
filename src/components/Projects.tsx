"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { projects, type Project } from "@/data/content";

function Visual({ p, i }: { p: Project; i: number }) {
  if (p.image) {
    return <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 90vw, 50vw" className="object-cover" />;
  }
  // Placeholder art until real screenshots exist
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `radial-gradient(circle at 70% 30%, ${p.accent}, #0a0a0a 70%)` }}>
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#f2efea22_1px,transparent_1px),linear-gradient(90deg,#f2efea22_1px,transparent_1px)] [background-size:40px_40px]" />
      <span className="absolute -bottom-6 -left-2 font-display text-[9rem] uppercase leading-none text-bone/90 md:text-[12rem]">
        {p.title}
      </span>
      <span className="absolute right-5 top-4 font-serif text-xl italic text-bone/80">{p.category}</span>
      <div className="absolute right-6 top-1/3 h-28 w-28 rounded-full border border-bone/40 md:h-40 md:w-40" style={{ transform: `rotate(${i * 30}deg)` }}>
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone" />
      </div>
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
        gsap.fromTo(
          card.querySelector(".project-visual"),
          { scale: 1.2 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "center center", scrub: true } },
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
          <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-blood">
            <span className="h-px w-10 bg-blood" /> 02 · Proyectos
          </p>
          <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-[7vw]">
            Trabajo que
            <br />
            <span className="font-serif normal-case italic text-blood">habla</span> solo
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/60">
            Una selección de lo que he construido. Desliza para ver cada uno.
          </p>
          <span className="mt-10 hidden items-center gap-3 text-xs uppercase tracking-[0.3em] text-bone/50 md:flex">
            Scroll <span className="inline-block h-px w-16 bg-bone/30" /> →
          </span>
        </div>

        {projects.map((p, i) => (
          <a
            key={p.title}
            href={p.href ?? "#"}
            target={p.href ? "_blank" : undefined}
            rel="noreferrer"
            data-cursor="Ver"
            className="project-card group block shrink-0 md:w-[46vw] lg:w-[40vw]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ash">
              <div className="project-visual absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <Visual p={p} i={i} />
              </div>
              <div className="absolute inset-0 bg-blood/0 mix-blend-multiply transition-colors duration-500 group-hover:bg-blood/30" />
            </div>
            <div className="mt-5 flex items-start justify-between gap-6 border-b border-bone/10 pb-5">
              <div className="flex items-start gap-5">
                <span className="font-display text-4xl text-blood">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wide">{p.title}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-mute">
                    {p.category} · {p.year}
                  </p>
                  <p className="mt-3 max-w-md text-sm text-bone/60">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border border-bone/15 px-3 py-1 text-[10px] uppercase tracking-widest text-bone/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-2xl text-bone/60 transition-all duration-300 group-hover:-rotate-45 group-hover:text-blood">→</span>
            </div>
          </a>
        ))}
        <div className="hidden w-[10vw] shrink-0 md:block" />
      </div>
    </section>
  );
}
