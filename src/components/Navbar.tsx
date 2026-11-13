"use client";
import { useEffect, useState } from "react";
import { profile } from "@/data/content";
import { scrollToId } from "./SmoothScroll";

const links = [
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "experiencia", label: "Experiencia" },
  { id: "proyectos", label: "Proyectos" },
  { id: "skills", label: "Herramientas" },
  { id: "contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-ink/70 backdrop-blur-md" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
          <button onClick={() => go("inicio")} className="group flex items-baseline gap-1" aria-label="Inicio">
            <span className="font-display text-2xl tracking-tight text-bone">{profile.name.charAt(0)}</span>
            <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
          </button>

          <ul className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="group relative text-xs uppercase tracking-[0.25em] text-bone/80 transition-colors hover:text-bone"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {profile.available && (
              <span className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bone/70 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Disponible
              </span>
            )}
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-bone/20 md:hidden"
              aria-label="Menú"
              aria-expanded={open}
            >
              <span className={`h-px w-5 bg-bone transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-bone transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-4 bg-accent px-8 transition-[clip-path] duration-700 ease-[cubic-bezier(.77,0,.18,1)] md:hidden ${
          open ? "[clip-path:circle(150%_at_100%_0)]" : "[clip-path:circle(0%_at_100%_0)]"
        }`}
      >
        {links.map((l, i) => (
          <button
            key={l.id}
            onClick={() => go(l.id)}
            className="text-left font-display text-6xl uppercase text-ink"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className="mr-3 font-sans text-sm text-ink/60">0{i + 1}</span>
            {l.label}
          </button>
        ))}
      </div>
    </>
  );
}
