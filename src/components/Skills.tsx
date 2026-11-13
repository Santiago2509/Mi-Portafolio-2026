"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { services, skills, toolbox } from "@/data/content";
import { brandOnDark, icons } from "@/data/icons";

const Keyboard3D = dynamic(() => import("./Keyboard3D"), { ssr: false });
const PhysicsPills = dynamic(() => import("./PhysicsPills"), { ssr: false });

const total = toolbox.reduce((n, c) => n + c.items.length, 0);

function Tool({ id }: { id: string }) {
  const icon = icons[id];
  if (!icon) return null;
  const color = brandOnDark(icon.hex);
  return (
    <li
      className="tool group flex items-center gap-3 rounded-xl border border-bone/10 bg-bone/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c)] hover:bg-[color-mix(in_srgb,var(--c)_12%,transparent)]"
      style={{ "--c": color } as React.CSSProperties}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-125" fill={color} aria-hidden>
        <path d={icon.path} />
      </svg>
      <span className="truncate text-sm text-bone/80 group-hover:text-bone">{icon.title}</span>
    </li>
  );
}

export default function Skills() {
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const line = useRef<HTMLParagraphElement>(null);
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active < 0 || !line.current) return;
    gsap.fromTo(line.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" });
  }, [active]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skills-title > span", {
        yPercent: 110,
        stagger: 0.08,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".skills-title", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Expand / collapse the full list
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const done = () => ScrollTrigger.refresh();
    if (open) {
      gsap.to(el, { height: "auto", duration: 0.9, ease: "expo.inOut", onComplete: done });
      gsap.fromTo(
        el.querySelectorAll(".tool"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.012, delay: 0.25 },
      );
    } else {
      gsap.to(el, { height: 0, duration: 0.7, ease: "expo.inOut", onComplete: done });
    }
  }, [open]);

  const s = active >= 0 ? skills[active] : null;
  const sColor = s ? brandOnDark(icons[s.icon]?.hex ?? "a995ff") : undefined;

  return (
    <section ref={root} id="skills" className="relative overflow-hidden bg-ink px-5 py-24 md:px-10 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />
      <div className="relative mx-auto max-w-[1400px]">
        <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-glow">
          <span className="h-px w-10 bg-accent" /> 04 · Herramientas
        </p>
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 className="skills-title flex flex-col overflow-hidden font-display text-6xl uppercase leading-[0.9] md:text-8xl">
              <span className="block">Mi caja</span>
              <span className="block">
                de <span className="font-serif normal-case italic text-glow">herramientas</span>
              </span>
            </h2>
            <p className="mt-6 max-w-sm text-sm text-bone/60">
              Toca una tecla (o escribe en tu teclado) para ver qué hago con cada una. Si no tocas nada, se
              presentan solas.
            </p>
            <div
              className="mt-10 min-h-[110px] border-l-2 pl-5 transition-colors duration-500"
              style={{ borderColor: sColor ?? "var(--color-accent)" }}
            >
              {s ? (
                <p ref={line}>
                  <span className="block text-xs uppercase tracking-[0.3em]" style={{ color: sColor }}>
                    {s.name}
                  </span>
                  <span className="mt-2 block font-serif text-3xl italic text-bone md:text-4xl">“{s.line}”</span>
                </p>
              ) : (
                <p className="text-xs uppercase tracking-[0.3em] text-bone/40">↳ Presiona una tecla</p>
              )}
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-bone/20 py-2 pl-6 pr-2 text-xs font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:border-accent hover:bg-accent"
            >
              {open ? "Ocultar" : `Ver las ${total} herramientas`}
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-bone text-ink transition-transform duration-500 ${open ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
          </div>
          <div className="relative h-[380px] md:h-[560px]">
            <Keyboard3D skills={skills} onChange={setActive} />
          </div>
        </div>

        {/* Full toolbox, by category */}
        <div ref={panel} className="h-0 overflow-hidden">
          <div className="grid gap-x-10 gap-y-10 pt-14 md:grid-cols-2 xl:grid-cols-3">
            {toolbox.map((c) => (
              <div key={c.category}>
                <h3 className="mb-4 flex items-baseline justify-between border-b border-bone/10 pb-3">
                  <span className="font-display text-2xl uppercase tracking-wide text-bone">{c.category}</span>
                  <span className="text-[11px] tracking-[0.2em] text-mute">{String(c.items.length).padStart(2, "0")}</span>
                </h3>
                <ul className="grid grid-cols-2 gap-2">
                  {c.items.map((id) => (
                    <Tool key={id} id={id} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Physics pills */}
        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-5xl uppercase leading-none md:text-7xl">
              Lo que <span className="font-serif normal-case italic text-glow">hago</span>
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-bone/40">Arrastra y lanza ↓</p>
          </div>
          <div className="mt-6 rounded-2xl border border-bone/10 bg-coal/60">
            <PhysicsPills items={services} />
          </div>
        </div>
      </div>
    </section>
  );
}
