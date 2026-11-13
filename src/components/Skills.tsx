"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { services, skills } from "@/data/content";

const Keyboard3D = dynamic(() => import("./Keyboard3D"), { ssr: false });
const PhysicsPills = dynamic(() => import("./PhysicsPills"), { ssr: false });

export default function Skills() {
  const [active, setActive] = useState(-1);
  const line = useRef<HTMLParagraphElement>(null);
  const root = useRef<HTMLElement>(null);

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

  const s = active >= 0 ? skills[active] : null;

  return (
    <section ref={root} id="skills" className="relative overflow-hidden bg-ink px-5 py-24 md:px-10 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full bg-blood/20 blur-[140px]" />
      <div className="relative mx-auto max-w-[1400px]">
        <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-blood">
          <span className="h-px w-10 bg-blood" /> 03 · Skills
        </p>
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 className="skills-title flex flex-col overflow-hidden font-display text-6xl uppercase leading-[0.9] md:text-8xl">
              <span className="block">Mi caja</span>
              <span className="block">
                de <span className="font-serif normal-case italic text-blood">herramientas</span>
              </span>
            </h2>
            <p className="mt-6 max-w-sm text-sm text-bone/60">
              Toca una tecla (o presiona cualquier tecla de tu teclado) para ver qué hago con cada herramienta.
            </p>
            <div className="mt-10 min-h-[110px] border-l-2 border-blood pl-5">
              {s ? (
                <p ref={line}>
                  <span className="block text-xs uppercase tracking-[0.3em] text-mute">{s.name}</span>
                  <span className="mt-2 block font-serif text-3xl italic text-bone md:text-4xl">“{s.line}”</span>
                </p>
              ) : (
                <p className="text-xs uppercase tracking-[0.3em] text-bone/40">↳ Presiona una tecla</p>
              )}
            </div>
          </div>
          <div className="relative h-[380px] md:h-[560px]">
            <Keyboard3D skills={skills} onChange={setActive} />
          </div>
        </div>

        {/* Physics pills */}
        <div className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-5xl uppercase leading-none md:text-7xl">
              Lo que <span className="font-serif normal-case italic text-blood">hago</span>
            </h3>
            <p className="text-xs uppercase tracking-[0.3em] text-bone/40">Arrastra y lanza ↓</p>
          </div>
          <div className="mt-6 rounded-sm border border-bone/10 bg-coal/60">
            <PhysicsPills items={services} />
          </div>
        </div>
      </div>
    </section>
  );
}
