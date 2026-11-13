"use client";
import { useEffect, useRef } from "react";
import Matter from "matter-js";

/** DOM pills driven by Matter.js. They drop in when visible and can be dragged/thrown. */
export default function PhysicsPills({ items }: { items: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  const pills = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = box.current!;
    let started = false;
    let cleanup = () => {};

    const start = () => {
      started = true;
      const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;
      const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
      const W = el.clientWidth;
      const H = el.clientHeight;
      const t = 200;
      const walls = [
        Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H / 2, t, H * 4, { isStatic: true }),
        Bodies.rectangle(W + t / 2, H / 2, t, H * 4, { isStatic: true }),
      ];
      const bodies = pills.current.map((p, i) => {
        const w = p!.offsetWidth;
        const h = p!.offsetHeight;
        const b = Bodies.rectangle(
          40 + Math.random() * (W - 80),
          -60 - i * 45,
          w,
          h,
          { chamfer: { radius: h / 2 }, restitution: 0.5, friction: 0.2, density: 0.002 },
        );
        Body.setAngle(b, (Math.random() - 0.5) * 0.8);
        return b;
      });
      Composite.add(engine.world, [...walls, ...bodies]);

      const mouse = Mouse.create(el);
      // let the page scroll over the canvas area
      const m = mouse as unknown as { element: HTMLElement; mousewheel: EventListener };
      m.element.removeEventListener("wheel", m.mousewheel);
      m.element.removeEventListener("mousewheel", m.mousewheel);
      m.element.removeEventListener("DOMMouseScroll", m.mousewheel);
      const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
      Composite.add(engine.world, mc);

      let raf = 0;
      let last = performance.now();
      let acc = 0;
      const STEP = 1000 / 60;
      const loop = (now: number) => {
        // fixed timestep so the motion is identical at any frame rate
        acc = Math.min(acc + (now - last), STEP * 6);
        last = now;
        while (acc >= STEP) {
          Engine.update(engine, STEP);
          acc -= STEP;
        }
        bodies.forEach((b, i) => {
          const p = pills.current[i];
          if (!p) return;
          p.style.transform = `translate(${b.position.x - p.offsetWidth / 2}px, ${b.position.y - p.offsetHeight / 2}px) rotate(${b.angle}rad)`;
          p.style.opacity = "1";
        });
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanup = () => {
        cancelAnimationFrame(raf);
        Mouse.clearSourceEvents(mouse);
        Engine.clear(engine);
      };
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) start();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div ref={box} className="relative h-[360px] w-full touch-pan-y select-none overflow-hidden md:h-[420px]">
      {items.map((t, i) => (
        <div
          key={t}
          ref={(n) => {
            pills.current[i] = n;
          }}
          className={`absolute left-0 top-0 cursor-grab whitespace-nowrap rounded-full px-6 py-3 font-display text-lg uppercase tracking-wide opacity-0 active:cursor-grabbing md:px-8 md:py-4 md:text-2xl ${
            i % 3 === 0 ? "bg-blood text-bone" : i % 3 === 1 ? "bg-bone text-ink" : "border border-bone/40 bg-ink text-bone"
          }`}
        >
          {t}
        </div>
      ))}
    </div>
  );
}
