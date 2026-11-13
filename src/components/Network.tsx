"use client";
import { useEffect, useRef } from "react";
import { holo } from "@/lib/holo";

type Node = {
  hx: number; // home position (drifts slowly)
  hy: number;
  vx: number;
  vy: number;
  x: number; // drawn position
  y: number;
  delay: number; // when the blast reaches this node
  r: number;
  k: number; // 0..1 flight progress
  heat: number; // 1 = just arrived (bright, linked), cools to 0
  g: number; // current glow (heat or cursor proximity)
};

const LINK = 135; // max distance for a connection
const CURSOR_R = 270; // connections light up around the cursor
const SPREAD = 3.8; // seconds for the blast to reach the far corners
const FLIGHT = 2.2; // seconds each node takes to fly to its place
const COOL = 2.4; // seconds a node stays "hot" after arriving

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Page-wide constellation. It stays dark while the hero is a hologram; as the
 * portrait finishes turning human (its particles streaming away) the nodes burst out from it, slowly, linking
 * into a circuit as the wave passes. Afterwards the field lives across the whole
 * site and connects around the cursor.
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
    let dpr = 1;
    let nodes: Node[] = [];
    let phase: "off" | "on" = "off";
    let t0 = 0; // blast start
    let fade = 0; // global opacity (lets the field retract when scrolling back up)
    let ox = 0;
    let oy = 0;
    let maxD = 1;
    const mouse = { x: -9999, y: -9999, seen: false };
    let raf = 0;
    let last = performance.now();

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(260, Math.max(60, (w * h) / 7000)));
      nodes = Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 4 + Math.random() * 9; // px / s
        return {
          hx: Math.random() * w,
          hy: Math.random() * h,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          x: 0,
          y: 0,
          delay: 0,
          r: 0.7 + Math.random() * 1.1,
          k: phase === "on" ? 1 : 0,
          heat: 0,
          g: 0,
        };
      });
      origin();
    };

    // The blast starts at the portrait's face
    const origin = () => {
      ox = w * 0.5;
      oy = h * 0.42;
      maxD = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy));
      for (const n of nodes) n.delay = (Math.hypot(n.hx - ox, n.hy - oy) / maxD) * SPREAD;
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

      // phase changes follow the hero transformation
      if (phase === "off" && holo.reveal >= 0.5) {
        phase = "on";
        t0 = t;
        origin();
        for (const n of nodes) {
          n.k = reduce ? 1 : 0;
          n.heat = 0;
        }
      }
      const wantOn = phase === "on" && holo.reveal > 0.4;
      fade += ((wantOn ? 1 : 0) - fade) * Math.min(1, dt * (wantOn ? 6 : 3.5));
      if (phase === "on" && !wantOn && fade < 0.02) phase = "off";

      ctx.clearRect(0, 0, w, h);
      if (phase === "off" || fade < 0.01) return;

      const el = t - t0;
      const ring = Math.min(w, h) * 0.24;

      // without a mouse (touch) a point wanders so the field still comes alive
      let cx = mouse.x;
      let cy = mouse.y;
      if (!fine || !mouse.seen) {
        cx = w * (0.5 + Math.sin(t * 0.31) * 0.34);
        cy = h * (0.5 + Math.sin(t * 0.23 + 1.3) * 0.32);
      }

      // soft shock wave: a slow ring + a gentle flash behind the portrait
      const wp = clamp01(el / (SPREAD + 1.2));
      if (wp < 1 && !reduce) {
        const R = easeOut(wp) * maxD * 1.05;
        const g = ctx.createRadialGradient(ox, oy, Math.max(0, R - 260), ox, oy, R + 30);
        g.addColorStop(0, "rgba(125,105,255,0)");
        g.addColorStop(0.82, `rgba(150,130,255,${0.1 * (1 - wp) * fade})`);
        g.addColorStop(1, "rgba(150,130,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.beginPath();
        ctx.arc(ox, oy, R, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(190,175,255,${0.32 * Math.pow(1 - wp, 1.5) * fade})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // update nodes
      const active: Node[] = [];
      for (const n of nodes) {
        n.hx += n.vx * dt;
        n.hy += n.vy * dt;
        if (n.hx < -20) n.hx = w + 20;
        else if (n.hx > w + 20) n.hx = -20;
        if (n.hy < -20) n.hy = h + 20;
        else if (n.hy > h + 20) n.hy = -20;

        if (n.k < 1) n.k = clamp01((el - n.delay) / FLIGHT);
        // nodes leave from a ring around the head (never from a single point),
        // so the burst reads as coming out of the portrait
        const e = easeOut(n.k);
        const ddx = n.hx - ox;
        const ddy = n.hy - oy;
        const dist = Math.hypot(ddx, ddy) || 1;
        const start = Math.min(dist, ring);
        const cur = start + (dist - start) * e;
        n.x = ox + (ddx / dist) * cur;
        n.y = oy + (ddy / dist) * cur;
        const since = el - n.delay; // seconds since the blast reached it
        n.heat = since > 0 && !reduce ? clamp01(1 - (since - FLIGHT * 0.5) / COOL) : 0;

        n.g = 0;
        if (n.k <= 0) continue;
        const near = clamp01(1 - Math.hypot(n.x - cx, n.y - cy) / CURSOR_R);
        const glow = Math.max(n.heat, near);
        if (glow > 0.02) active.push(n);
        n.g = glow * Math.min(1, n.k * 3); // fade links in as the node takes off
        // dot
        const a = (0.3 + glow * 0.7) * Math.min(1, n.k * 3) * fade;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${200 + glow * 55},${190 + glow * 60},255,${a})`;
        ctx.fill();
      }

      // links + triangles among the lit nodes (blast front and around the cursor)
      const list = active;
      ctx.lineWidth = 1;
      for (let i = 0; i < list.length; i++) {
        const a = list[i];
        for (let j = i + 1; j < list.length; j++) {
          const b = list[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx > LINK || dx < -LINK || dy > LINK || dy < -LINK) continue;
          const d = Math.hypot(dx, dy);
          if (d > LINK || d < 6) continue;
          const s = (1 - d / LINK) * Math.min(a.g, b.g) * 1.6 * fade;
          if (s < 0.02) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(128,122,255,${Math.min(0.85, s)})`;
          ctx.stroke();
          // filled facets, like folded paper, where three lit nodes meet
          if (s > 0.25 && a.k >= 1 && b.k >= 1 && list.length < 70) {
            for (let k = j + 1; k < list.length; k++) {
              const c = list[k];
              if (c.k < 1) continue;
              if (Math.hypot(a.x - c.x, a.y - c.y) > LINK * 0.8 || Math.hypot(b.x - c.x, b.y - c.y) > LINK * 0.8) continue;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.lineTo(c.x, c.y);
              ctx.closePath();
              ctx.fillStyle = `rgba(110,100,255,${Math.min(0.1, s * 0.12 * c.g)})`;
              ctx.fill();
            }
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
