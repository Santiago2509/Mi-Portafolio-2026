"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { moreProjects } from "@/data/content";

/** Other projects from GitHub, revealed with "Ver más proyectos". */
export default function MoreProjects() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const done = () => ScrollTrigger.refresh();
    if (open) {
      gsap.to(el, { height: "auto", duration: 0.9, ease: "expo.inOut", onComplete: done });
      gsap.fromTo(
        el.querySelectorAll(".more-card"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.07, delay: 0.25 },
      );
    } else {
      gsap.to(el, { height: 0, duration: 0.7, ease: "expo.inOut", onComplete: done });
    }
  }, [open]);

  return (
    <section className="relative bg-ink px-5 pb-10 pt-4 md:px-10 md:pb-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-bone/10 pt-10">
          <div>
            <h3 className="font-display text-4xl uppercase leading-none md:text-5xl">
              Más <span className="font-serif normal-case italic text-glow">proyectos</span>
            </h3>
            <p className="mt-3 max-w-md text-[15px] text-bone/78">
              Otros proyectos personales, académicos y en equipo que tengo en GitHub.
            </p>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="group inline-flex items-center gap-3 rounded-full border border-bone/20 py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:border-accent hover:bg-accent"
          >
            {open ? "Ocultar" : `Ver ${moreProjects.length} proyectos más`}
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ${open ? "rotate-45" : ""}`}
            >
              +
            </span>
          </button>
        </div>

        <div ref={panel} className="h-0 overflow-hidden">
          <div className="grid gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {moreProjects.map((p) => (
              <article
                key={p.title}
                className="more-card group flex flex-col rounded-2xl border border-bone/10 bg-bone/[0.03] p-6 transition-colors duration-500 hover:border-accent/60 hover:bg-accent/[0.07]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[12px] uppercase tracking-[0.2em] text-mute">{p.category}</p>
                  {p.team && (
                    <span className="rounded-full border border-glow/40 px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-glow">
                      En equipo
                    </span>
                  )}
                </div>
                <h4 className="mt-3 font-display text-3xl uppercase leading-none text-bone transition-colors group-hover:text-glow">
                  {p.title}
                </h4>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-bone/80">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-bone/15 px-3 py-1 text-[12px] uppercase tracking-widest text-bone/82">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-5 border-t border-bone/10 pt-4 text-[13px] font-semibold uppercase tracking-[0.15em]">
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="text-bone transition-colors hover:text-glow">
                      Código ↗
                    </a>
                  )}
                  {p.href && (
                    <a href={p.href} target="_blank" rel="noreferrer" className="text-bone transition-colors hover:text-glow">
                      Demo ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
