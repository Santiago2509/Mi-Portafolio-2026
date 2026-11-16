"use client";
import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const MAX_TILT = 0.2; // rad (~11°): the words always stay readable, never sideways or upside down

// visual styles, cycled so neighbouring pills look different
const STYLES = [
  "bg-accent text-bone",
  "bg-bone text-ink",
  "border border-bone/40 bg-ink text-bone",
  "bg-glow text-ink",
  "border border-glow/60 bg-accent/10 text-glow",
];

/** DOM pills driven by Matter.js. They drop in when visible and can be dragged/thrown. */
export default function PhysicsPills({ items }: { items: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  const pills = useRef<(HTMLDivElement | null)[]>([]);
  // fewer pills on small screens so they fit the box
  const [list, setList] = useState(items);

  useEffect(() => {
    if (window.innerWidth < 768) setList(items.slice(0, 16));
  }, [items]);

  useEffect(() => {
    const el = box.current!;
    let started = false;
    let cleanup = () => {};

    const start = () => {
      started = true;
      const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;
      const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
      const W = el.clientWidth;
      const H = el.clientHeight;
      const t = 200;
      const walls = [
        Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H / 2, t, H * 4, { isStatic: true }),
        Bodies.rectangle(W + t / 2, H / 2, t, H * 4, { isStatic: true }),
      ];
      const nodes = pills.current.slice(0, list.length);
      const bodies = nodes.map((p, i) => {
        const w = p!.offsetWidth;
        const h = p!.offsetHeight;
        const b = Bodies.rectangle(
          w / 2 + 10 + Math.random() * Math.max(1, W - w - 20),
          -60 - i * 38,
          w,
          h,
          { chamfer: { radius: h / 2 }, restitution: 0.35, friction: 0.35, frictionAir: 0.012, density: 0.002 },
        );
        Body.setAngle(b, (Math.random() - 0.5) * MAX_TILT * 2);
        return b;
      });
      Composite.add(engine.world, [...walls, ...bodies]);

      // keep every pill upright: limit the tilt and pull it gently back towards level
      Events.on(engine, "afterUpdate", () => {
        for (const b of bodies) {
          let a = b.angle;
          if (a > MAX_TILT || a < -MAX_TILT) {
            a = Math.max(-MAX_TILT, Math.min(MAX_TILT, a));
            Body.setAngle(b, a);
            Body.setAngularVelocity(b, 0);
          } else {
            Body.setAngularVelocity(b, b.angularVelocity * 0.9 - a * 0.004);
          }
        }
      });

      const mouse = Mouse.create(el);
      // let the page scroll over the box
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
          const p = nodes[i];
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
  }, [list]);

  return (
    <div ref={box} className="relative h-[480px] w-full touch-pan-y select-none overflow-hidden md:h-[440px]">
      {list.map((t, i) => (
        <div
          key={t}
          ref={(n) => {
            pills.current[i] = n;
          }}
          className={`absolute left-0 top-0 cursor-grab whitespace-nowrap rounded-full px-5 py-2.5 font-display text-base uppercase tracking-wide opacity-0 active:cursor-grabbing md:px-7 md:py-3.5 md:text-2xl ${
            STYLES[i % STYLES.length]
          }`}
        >
          {t}
        </div>
      ))}
    </div>
  );
}
