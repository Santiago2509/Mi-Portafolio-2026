"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { icons } from "@/data/icons";

type Skill = { icon: string; name: string; line: string };

const COLS = 5;
const GAP = 1.1;

function luminance(hex: string) {
  const n = parseInt(hex, 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** Brand color for the cap + contrasting color for the logo. */
function palette(hex: string) {
  const lum = luminance(hex);
  const cap = lum < 0.02 ? "#1c1c1c" : `#${hex}`;
  const ink = lum > 0.45 ? "#111111" : "#ffffff";
  return { cap, ink };
}

function useIconTexture(iconKey: string, ink: string) {
  return useMemo(() => {
    const icon = icons[iconKey];
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    if (icon) {
      const size = 160;
      g.translate((256 - size) / 2, (256 - size) / 2);
      g.scale(size / 24, size / 24);
      g.fillStyle = ink;
      g.fill(new Path2D(icon.path));
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [iconKey, ink]);
}

function Key({
  skill,
  index,
  rows,
  active,
  onPress,
}: {
  skill: Skill;
  index: number;
  rows: number;
  active: boolean;
  onPress: (i: number) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hover, setHover] = useState(false);
  const { cap, ink } = palette(icons[skill.icon]?.hex ?? "1c1c1c");
  const tex = useIconTexture(skill.icon, ink);
  const capColor = useMemo(() => new THREE.Color(cap), [cap]);
  const skirtColor = useMemo(() => new THREE.Color(cap).multiplyScalar(0.62), [cap]);
  const x = ((index % COLS) - (COLS - 1) / 2) * GAP;
  const z = (Math.floor(index / COLS) - (rows - 1) / 2) * GAP;
  const pressT = useRef(0);

  useEffect(() => {
    if (active) pressT.current = 1;
  }, [active]);

  useFrame((state, dt) => {
    if (!ref.current) return;
    pressT.current = Math.max(0, pressT.current - dt * 2.5);
    const idle = Math.sin(state.clock.elapsedTime * 1.3 + index * 0.55) * 0.025;
    const target = (hover ? 0.18 : 0) - pressT.current * 0.24 + idle;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, target, 14, dt);
    if (mat.current) {
      mat.current.emissiveIntensity = THREE.MathUtils.damp(
        mat.current.emissiveIntensity,
        active ? 0.55 * pressT.current + 0.15 : hover ? 0.2 : 0,
        8,
        dt,
      );
    }
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
      {/* Skirt (lower, wider part of the keycap) */}
      <RoundedBox args={[1, 0.36, 1]} radius={0.12} smoothness={4} position={[0, 0.18, 0]} castShadow>
        <meshPhysicalMaterial color={skirtColor} roughness={0.5} clearcoat={0.4} />
      </RoundedBox>
      {/* Top surface */}
      <RoundedBox args={[0.84, 0.2, 0.84]} radius={0.09} smoothness={4} position={[0, 0.4, -0.02]} castShadow>
        <meshPhysicalMaterial
          ref={mat}
          color={capColor}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.12}
          emissive={capColor}
          emissiveIntensity={0}
        />
      </RoundedBox>
      {/* Logo */}
      <mesh position={[0, 0.502, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.66, 0.66]} />
        <meshStandardMaterial map={tex} transparent roughness={0.4} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
    </group>
  );
}

function Board({ skills, active, onPress }: { skills: Skill[]; active: number; onPress: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const rows = Math.ceil(skills.length / COLS);
  useFrame((state, dt) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.1 - y * 0.15, 4, dt);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -x * 0.1, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.5 + x * 0.25, 4, dt);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });
  return (
    <group ref={group}>
      <RoundedBox
        args={[COLS * GAP + 0.35, 0.4, rows * GAP + 0.35]}
        radius={0.2}
        smoothness={4}
        position={[0, -0.18, 0]}
        receiveShadow
      >
        <meshPhysicalMaterial color="#0e0e0e" roughness={0.3} metalness={0.5} clearcoat={0.6} />
      </RoundedBox>
      {skills.map((s, i) => (
        <Key key={s.icon} skill={s} index={i} rows={rows} active={active === i} onPress={onPress} />
      ))}
    </group>
  );
}

export default function Keyboard3D({ skills, onChange }: { skills: Skill[]; onChange: (i: number) => void }) {
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

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

  // Physical keyboard: first letter of the skill, otherwise a random key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      const matches = skills.map((s, i) => [s, i] as const).filter(([s]) => s.name.toLowerCase().startsWith(e.key.toLowerCase()));
      const pick = matches.length ? matches[Math.floor(Math.random() * matches.length)][1] : Math.floor(Math.random() * skills.length);
      press(pick);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, skills]);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 8.2, 7.4], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ camera }) => camera.lookAt(0, -0.4, 0)}
      >
        <ambientLight intensity={0.35} />
        <spotLight position={[4, 9, 5]} angle={0.5} penumbra={0.8} intensity={70} castShadow />
        <pointLight position={[-5, 2, -2]} intensity={45} color="#ff2a1f" />
        {/* Soft studio reflections for the glossy caps (no external HDR files) */}
        <Environment resolution={128}>
          <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
          <Lightformer intensity={1.5} color="#ff2a1f" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
          <Lightformer intensity={0.8} position={[5, 1, 3]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
        </Environment>
        <Board skills={skills} active={active} onPress={press} />
        <ContactShadows position={[0, -0.6, 0]} opacity={0.65} scale={14} blur={2.6} far={3} color="#000000" />
      </Canvas>
    </div>
  );
}
