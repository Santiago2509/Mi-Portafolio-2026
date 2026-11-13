"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

type Skill = { key: string; name: string; line: string };

const COLS = 4;
const GAP = 1.18;

function useLabelTexture(text: string, accent: boolean, fontFamily: string) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = accent ? "#e10600" : "#161616";
    g.fillRect(0, 0, 256, 256);
    // subtle inner gradient
    const grd = g.createRadialGradient(128, 90, 10, 128, 128, 180);
    grd.addColorStop(0, accent ? "rgba(255,90,70,0.55)" : "rgba(255,255,255,0.07)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = accent ? "#0a0a0a" : "#f2efea";
    const size = text.length > 4 ? 64 : text.length > 2 ? 84 : 110;
    g.font = `${size}px ${fontFamily}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text.toUpperCase(), 128, 136);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [text, accent, fontFamily]);
}

function Key({
  skill,
  index,
  active,
  onPress,
  fontFamily,
}: {
  skill: Skill;
  index: number;
  active: boolean;
  onPress: (i: number) => void;
  fontFamily: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const accent = index % 5 === 0;
  const tex = useLabelTexture(skill.key, accent, fontFamily);
  const rows = Math.ceil(12 / COLS);
  const x = ((index % COLS) - (COLS - 1) / 2) * GAP;
  const z = (Math.floor(index / COLS) - (rows - 1) / 2) * GAP;
  const pressT = useRef(0);

  useEffect(() => {
    if (active) pressT.current = 1;
  }, [active]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    pressT.current = Math.max(0, pressT.current - dt * 3);
    const idle = Math.sin(state.clock.elapsedTime * 1.4 + index * 0.6) * 0.04;
    const target = (hover ? 0.22 : 0) - pressT.current * 0.28 + idle;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, target, 12, dt);
  });

  const handle = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPress(index);
  };

  return (
    <group
      ref={ref}
      position={[x, 0, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
      onPointerDown={handle}
    >
      <RoundedBox args={[1, 0.55, 1]} radius={0.12} smoothness={4} position={[0, 0.27, 0]} castShadow>
        <meshStandardMaterial
          color={accent ? "#b00500" : "#121212"}
          roughness={0.45}
          metalness={0.1}
          emissive={active || hover ? "#e10600" : "#000000"}
          emissiveIntensity={active ? 0.6 : hover ? 0.25 : 0}
        />
      </RoundedBox>
      <mesh position={[0, 0.552, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial map={tex} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Board({ skills, active, onPress, fontFamily }: { skills: Skill[]; active: number; onPress: (i: number) => void; fontFamily: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.15 - y * 0.18, 4, dt);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -x * 0.12, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.35 + x * 0.25, 4, dt);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });
  const rows = Math.ceil(skills.length / COLS);
  return (
    <group ref={group}>
      <RoundedBox args={[COLS * GAP + 0.4, 0.35, rows * GAP + 0.4]} radius={0.18} smoothness={4} position={[0, -0.12, 0]} receiveShadow>
        <meshStandardMaterial color="#0d0d0d" roughness={0.35} metalness={0.6} />
      </RoundedBox>
      {skills.map((s, i) => (
        <Key key={s.key} skill={s} index={i} active={active === i} onPress={onPress} fontFamily={fontFamily} />
      ))}
    </group>
  );
}

export default function Keyboard3D({ skills, onChange }: { skills: Skill[]; onChange: (i: number) => void }) {
  const [active, setActive] = useState(-1);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fam = getComputedStyle(document.body).getPropertyValue("--font-anton").trim() || "Impact";
    document.fonts.ready.then(() => setFontFamily(fam));
  }, []);

  // Only render frames while on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const press = (i: number) => {
    setActive(-1);
    requestAnimationFrame(() => setActive(i));
    onChange(i);
  };

  // Any physical key presses a random keycap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.metaKey || e.ctrlKey || e.key.length !== 1) return;
      const idx = skills.findIndex((s) => s.key.toLowerCase().startsWith(e.key.toLowerCase()));
      press(idx >= 0 ? idx : Math.floor(Math.random() * skills.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, skills]);

  return (
    <div ref={wrap} className="h-full w-full">
      {fontFamily && (
        <Canvas
          shadows
          dpr={[1, 1.75]}
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 7.4, 6.6], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ camera }) => camera.lookAt(0, -0.3, 0)}
        >
          <ambientLight intensity={0.25} />
          <spotLight position={[4, 8, 4]} angle={0.5} penumbra={0.8} intensity={60} castShadow color="#ffffff" />
          <pointLight position={[-4, 2, -2]} intensity={40} color="#ff2a1f" />
          <pointLight position={[3, 1, 3]} intensity={12} color="#ff5a1f" />
          <Board skills={skills} active={active} onPress={press} fontFamily={fontFamily} />
          <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={12} blur={2.6} far={3} color="#000000" />
        </Canvas>
      )}
    </div>
  );
}
