"use client";
import { useEffect, useRef } from "react";
import { holo } from "@/lib/holo";

type Node = {
  hx: number; // rest position (drifts slowly)
  hy: number;
  vx: number;
  vy: number;
  x: number; // drawn position
  y: number;
  r: number;
  local: boolean; // "rider": travels with the wave front (hx = angle, hy = distance behind the front)
  g: number; // current glow (wave crest or cursor proximity)
};

const LINK = 135; // max distance for a connection
const CURSOR_R = 270; // connections light up around the cursor
const LAMBDA = 105; // distance between ripples (px)
const DECAY = 330; // how far behind the front the ripples stay visible (px)
const BAND = 230; // width of the mesh that rides the wave (px)
const TRAVEL = 5.2; // seconds for the wave to cross the page once the portrait is human

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * The "nanotech": a mesh of nodes and links that is revealed by a wave.
 *
 * The wave is born at the centre of the portrait's face and grows with the scroll,
 * in step with the hologram → human transformation. When the portrait is fully
 * human the wave keeps travelling on its own, slowly, across the whole page —
 * concentric ripples like a drop falling on water. Where a crest passes, the mesh
 * lights up and sways; behind it the nodes settle into a faint field that
 * connects around the cursor for the rest of the site.
 */
export default function Network() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let R = 0; // current wave radius (px)
    const mouse = { x: -9999, y: -9999, seen: false };
    let raf = 0;
    let last = performance.now();

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(260, Math.max(60, (w * h) / 7000)));
      const make = (local: boolean): Node => {
        const a = Math.random() * Math.PI * 2;
        const sp = local ? 0 : 4 + Math.random() * 9; // px / s
        return {
          hx: local ? a : Math.random() * w,
          hy: local ? -Math.random() * BAND : Math.random() * h,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          x: 0,
          y: 0,
          r: 0.7 + Math.random() * 1.1,
          local,
          g: 0,
        };
      };
      nodes = [
        ...Array.from({ length: count }, () => make(false)),
        ...Array.from({ length: Math.round(Math.min(170, Math.max(70, count * 0.7))) }, () => make(true)),
      ];
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.seen = true;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // wave origin = centre of the face (falls back to a sensible spot before WebGL reports it)
      const unit = holo.unit || h * 0.55;
      const ox = holo.cx || w * 0.5;
      const oy = holo.cy || h * 0.4;
      const maxD = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) + DECAY * 1.6;

      // While scrolling the wave follows the transformation; once human it travels on by itself
      const human = holo.reveal >= 0.999;
      const target = human ? maxD : holo.reveal * holo.maxR * unit;
      if (reduce) R = target;
      else if (human && target > R) R = Math.min(target, R + (maxD / TRAVEL) * dt);
      else R += (target - R) * Math.min(1, dt * 9);

      ctx.clearRect(0, 0, w, h);
      if (R < 1.5) return;

      // without a mouse (touch) a point wanders so the settled field still comes alive
      let cx = mouse.x;
      let cy = mouse.y;
      if (!fine || !mouse.seen) {
        cx = w * (0.5 + Math.sin(t * 0.31) * 0.34);
        cy = h * (0.5 + Math.sin(t * 0.23 + 1.3) * 0.32);
      }

      // water rings: the front and the ripples that follow it
      if (!reduce) {
        for (let i = 0; i < 4; i++) {
          const rad = R - i * LAMBDA;
          if (rad <= 2) break;
          const a = 0.34 * Math.exp((-i * LAMBDA) / (DECAY * 0.8)) * clamp01((maxD - R) / 260);
          if (a < 0.01) continue;
          ctx.beginPath();
          ctx.arc(ox, oy, rad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(190,178,255,${a})`;
          ctx.lineWidth = i === 0 ? 1.4 : 1;
          ctx.stroke();
        }
        // soft swell just behind the front
        const g = ctx.createRadialGradient(ox, oy, Math.max(0, R - DECAY), ox, oy, R);
        g.addColorStop(0, "rgba(125,105,255,0)");
        g.addColorStop(0.85, `rgba(140,120,255,${0.07 * clamp01((maxD - R) / 260)})`);
        g.addColorStop(1, "rgba(140,120,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // nodes
      const grow = clamp01((R - 40) / 420); // 0 at the face → 1 once the ring is wide
      const active: Node[] = [];
      for (const n of nodes) {
        if (n.local) {
          // Riders: the nanotech mesh itself. It is born at the centre of the face and
          // travels outward on the wave; as the ring grows the mesh thins out and
          // dissolves into the page.
          n.g = 0;
          // near the face the ring is thin and sparse (the face stays visible through
          // its hollow centre); it widens and fills in as it grows
          if (reduce || n.r - 0.7 > grow * 1.1) continue; // n.r doubles as a stable 0..1.1 random
          const rad = R + n.hy * (0.22 + 0.78 * grow) + Math.sin(t * 0.8 + n.hx * 3) * 8 * grow;
          if (rad <= 4) continue;
          n.x = ox + Math.cos(n.hx) * rad;
          n.y = oy + Math.sin(n.hx) * rad;
          const ripple = 0.6 + 0.4 * Math.cos((n.hy / LAMBDA) * Math.PI * 2);
          const glow = clamp01(rad / 30) * clamp01((maxD - R) / (maxD * 0.4)) * ripple;
          if (glow < 0.03) continue;
          n.g = glow;
          active.push(n);
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + glow * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${205 + glow * 50},${195 + glow * 55},255,${glow * 0.95})`;
          ctx.fill();
          continue;
        }
        n.hx += n.vx * dt;
        n.hy += n.vy * dt;
        if (n.hx < -20) n.hx = w + 20;
        else if (n.hx > w + 20) n.hx = -20;
        if (n.hy < -20) n.hy = h + 20;
        else if (n.hy > h + 20) n.hy = -20;
        const bx = n.hx;
        const by = n.hy;
        const dx = bx - ox;
        const dy = by - oy;
        const d = Math.hypot(dx, dy) || 1;
        const behind = R - d; // > 0 once the front has passed this node
        n.g = 0;
        if (behind <= 0) continue;

        // ripple profile behind the front: crests every LAMBDA, fading with distance
        const env = Math.exp(-behind / DECAY) * (0.88 + 0.12 * Math.sin(t * 2.2 - behind * 0.03));
        const phase = (behind / LAMBDA) * Math.PI * 2;
        const crest = Math.max(0, Math.cos(phase));
        const wave = reduce ? 0 : env * (0.3 + 0.7 * crest);
        // the mesh sways radially as the ripples go through it
        const sway = reduce ? 0 : Math.sin(phase) * env * 10;
        n.x = bx + (dx / d) * sway;
        n.y = by + (dy / d) * sway;

        const appear = clamp01(behind / 26);
        const near = clamp01(1 - Math.hypot(n.x - cx, n.y - cy) / CURSOR_R);
        const glow = Math.max(wave, near) * appear;
        n.g = glow;
        if (glow > 0.03) active.push(n);

        const a = (0.3 + glow * 0.7) * appear;
        if (a < 0.02) continue;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${200 + glow * 55},${190 + glow * 60},255,${a})`;
        ctx.fill();
      }

      // links + facets among the lit nodes (on the ripples and around the cursor)
      const facets = active.length < 280;
      ctx.lineWidth = 1;
      for (let i = 0; i < active.length; i++) {
        const a = active[i];
        for (let j = i + 1; j < active.length; j++) {
          const b = active[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx > LINK || dx < -LINK || dy > LINK || dy < -LINK) continue;
          const d = Math.hypot(dx, dy);
          if (d > LINK || d < 6) continue;
          const s = (1 - d / LINK) * Math.min(a.g, b.g) * 1.9;
          if (s < 0.02) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(128,122,255,${Math.min(0.85, s)})`;
          ctx.stroke();
          if (!facets || s < 0.28 || grow < 0.15) continue;
          for (let k = j + 1; k < active.length; k++) {
            const c = active[k];
            if (Math.hypot(a.x - c.x, a.y - c.y) > LINK * 0.8 || Math.hypot(b.x - c.x, b.y - c.y) > LINK * 0.8) continue;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.closePath();
            ctx.fillStyle = `rgba(110,100,255,${Math.min(0.05, s * 0.065 * c.g) * grow})`;
            ctx.fill();
          }
        }
      }
    };

    build();
    window.addEventListener("resize", build);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}
