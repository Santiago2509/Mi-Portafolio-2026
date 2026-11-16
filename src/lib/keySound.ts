"use client";

/**
 * Mechanical keyboard sound, synthesised with Web Audio (no audio files).
 * A press = a short "thock" (low body resonance with a quick pitch drop) plus a
 * bright click of filtered noise; a softer click follows on release. Every press
 * is slightly detuned so repeated keys never sound identical.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.25), ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function click(c: AudioContext, t: number, freq: number, gain: number, dur: number) {
  const src = c.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = 0.9 + Math.random() * 0.2;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 1.4;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(master!);
  src.start(t, Math.random() * 0.1, dur + 0.02);
}

function thock(c: AudioContext, t: number, base: number, gain: number) {
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(base * 1.9, t);
  o.frequency.exponentialRampToValueAtTime(base, t + 0.03);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1400;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  o.connect(lp).connect(g).connect(master!);
  o.start(t);
  o.stop(t + 0.1);
}

/** Plays one key press. `variant` (e.g. the key index) shifts the pitch a little per key. */
export function playKey(variant = 0) {
  const c = ensure();
  if (!c || !master || !noise) return;
  const t = c.currentTime + 0.005;
  const v = (variant % 7) / 7;
  const base = 150 + v * 45 + Math.random() * 18;
  thock(c, t, base, 0.55);
  click(c, t, 3200 + v * 900 + Math.random() * 500, 0.5, 0.035);
  // release, a little later and softer
  const r = t + 0.075 + Math.random() * 0.03;
  click(c, r, 2600 + Math.random() * 600, 0.22, 0.025);
  thock(c, r, base * 1.25, 0.18);
}
