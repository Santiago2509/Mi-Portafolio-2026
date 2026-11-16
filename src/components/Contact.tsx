"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/content";
import { siGithub, siInstagram, siTiktok } from "simple-icons";

// LinkedIn is not in simple-icons; standard "in" glyph
const LINKEDIN =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z";
const SOCIAL_ICON: Record<string, string> = { linkedin: LINKEDIN, instagram: siInstagram.path, tiktok: siTiktok.path };
import { scrollToId } from "./SmoothScroll";

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const qx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    const qy = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width / 2)) * 0.35);
      qy((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const leave = () => {
      qx(0);
      qy(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div ref={ref} className="inline-block">{children}</div>;
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-line > span", {
        yPercent: 110,
        stagger: 0.1,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact-title", start: "top 80%" },
      });
      gsap.fromTo(
        ".contact-photo",
        { yPercent: 25 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
        },
      );
      gsap.fromTo(
        ".footer-word",
        { yPercent: 60 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: ".footer-word", start: "top bottom", end: "bottom bottom", scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const rows = [
    { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
    ...(profile.phone ? [{ k: "Teléfono", v: profile.phone, href: `tel:${profile.phone}` }] : []),
    { k: "Ubicación", v: profile.location, href: undefined },
  ];

  return (
    <section ref={root} id="contacto" className="relative overflow-hidden bg-ink px-5 pt-24 md:px-10 md:pt-36">
      <div className="pointer-events-none absolute bottom-0 right-0 h-[70vmin] w-[70vmin] translate-x-1/4 rounded-full bg-accent/25 blur-[140px]" />
      <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <p className="mb-6 flex items-center gap-3 text-[13px] uppercase tracking-[0.3em] text-glow">
            Contacto
          </p>
          <h2 className="contact-title font-display text-[17vw] uppercase leading-[0.85] lg:text-[9vw]">
            <span className="contact-line block overflow-hidden">
              <span className="block">Hagamos</span>
            </span>
            <span className="contact-line block overflow-hidden">
              <span className="block">
                algo <span className="font-serif normal-case italic text-glow">épico</span>
              </span>
            </span>
          </h2>
          <p className="mt-6 max-w-md text-bone/78">
            Estoy abierto a nuevos proyectos y colaboraciones. Si tienes una idea, hablemos y la hacemos realidad.
          </p>

          <div className="mt-10">
            <Magnetic>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="Hola"
                className="flex h-36 w-36 items-center justify-center rounded-full bg-accent text-center font-display text-xl uppercase leading-tight text-bone transition-colors hover:bg-bone hover:text-ink md:h-44 md:w-44 md:text-2xl"
              >
                Escríbeme
                <br />↗
              </a>
            </Magnetic>
          </div>

          <ul className="mt-14 divide-y divide-bone/10 border-y border-bone/10">
            {rows.map((r) => (
              <li key={r.k} className="flex items-center justify-between py-5">
                <span className="text-[13px] uppercase tracking-[0.25em] text-mute">{r.k}</span>
                {r.href ? (
                  <a href={r.href} className="text-lg text-bone transition-colors hover:text-glow md:text-xl">
                    {r.v}
                  </a>
                ) : (
                  <span className="text-lg text-bone md:text-xl">{r.v}</span>
                )}
              </li>
            ))}
            <li className="flex flex-wrap items-center justify-between gap-4 py-5">
              <span className="text-[13px] uppercase tracking-[0.25em] text-mute">GitHub</span>
              <div className="flex flex-wrap gap-6">
                {profile.github.map((g) => (
                  <a
                    key={g.href}
                    href={g.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center gap-2 text-[15px] text-bone"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                      <path d={siGithub.path} />
                    </svg>
                    {g.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all group-hover:w-full" />
                  </a>
                ))}
              </div>
            </li>
            <li className="flex flex-wrap items-center justify-between gap-4 py-5">
              <span className="text-[13px] uppercase tracking-[0.25em] text-mute">Redes</span>
              <div className="flex flex-wrap gap-6">
                {profile.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center gap-2 text-[15px] uppercase tracking-[0.2em] text-bone"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                      <path d={SOCIAL_ICON[s.icon]} />
                    </svg>
                    {s.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all group-hover:w-full" />
                  </a>
                ))}
              </div>
            </li>
          </ul>
        </div>

        <div className="relative hidden min-h-[640px] lg:block">
          <div className="contact-photo absolute inset-x-0 bottom-0 h-full">
            <Image
              src="/images/hoodie.webp"
              alt={`${profile.name} con hoodie blanco y gafas`}
              fill
              sizes="40vw"
              className="object-contain object-bottom grayscale contrast-125 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative mx-auto mt-10 max-w-[1600px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 py-6 text-[13px] uppercase tracking-[0.25em] text-bone/72">
          <span>© 2026 {profile.name}</span>
          <span>Hecho con código y actitud</span>
          <button onClick={() => scrollToId("inicio")} className="transition-colors hover:text-glow">
            Volver arriba ↑
          </button>
        </div>
        <div className="overflow-hidden">
          <p className="footer-word select-none text-center font-display text-[24vw] uppercase leading-[0.78] text-glow">
            {profile.heroWord}
          </p>
        </div>
      </footer>
    </section>
  );
}
