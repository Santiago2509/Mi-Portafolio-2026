"use client";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, ContactShadows, Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { icons } from "@/data/icons";

type Skill = { icon: string; name: string; line: string };
type Ripple = { index: number; time: number };

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

const easeOutBack = (x: number) => 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2);

function Key({
  skill,
  index,
  rows,
  active,
  entered,
  ripple,
  onPress,
}: {
  skill: Skill;
  index: number;
  rows: number;
  active: boolean;
  entered: boolean;
  ripple: MutableRefObject<Ripple>;
  onPress: (i: number) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hover, setHover] = useState(false);
  const { cap, ink } = palette(icons[skill.icon]?.hex ?? "1c1c1c");
  const tex = useIconTexture(skill.icon, ink);
  const capColor = useMemo(() => new THREE.Color(cap), [cap]);
  const skirtColor = useMemo(() => new THREE.Color(cap).multiplyScalar(0.62), [cap]);
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const x = (col - (COLS - 1) / 2) * GAP;
  const z = (row - (rows - 1) / 2) * GAP;
  const enterT = useRef(0);
  const y = useRef(0);

  useFrame((state, dt) => {
    if (!ref.current) return;
    const now = state.clock.elapsedTime;

    // 1) entrance: keys rain in one after another and spin into place
    if (entered) enterT.current = Math.min(1, enterT.current + dt / 1.8);
    const delay = (col + row) * 0.07 + (index % 3) * 0.03;
    const e = THREE.MathUtils.clamp((enterT.current * (0.9 + 1.2) - delay) / 0.9, 0, 1);
    const drop = (1 - easeOutBack(e)) * 6;
    ref.current.visible = e > 0;
    ref.current.rotation.y = (1 - e) * Math.PI * 1.5;
    ref.current.scale.setScalar(0.4 + 0.6 * e);

    // 2) ripple: a wave travels outward from the last pressed key
    const r = ripple.current;
    const dist = Math.hypot(col - (r.index % COLS), row - Math.floor(r.index / COLS));
    const rt = now - r.time - dist * 0.075;
    const wave = rt > 0 && rt < 0.55 ? -Math.sin((rt / 0.55) * Math.PI) * (dist === 0 ? 0.26 : 0.16 / (1 + dist * 0.35)) : 0;

    // 3) idle float + hover lift + selected key stays slightly raised
    const idle = Math.sin(now * 1.3 + index * 0.55) * 0.025;
    const target = (hover ? 0.18 : 0) + (active ? 0.1 : 0) + idle + wave;
    y.current = THREE.MathUtils.damp(y.current, target, 16, dt);
    ref.current.position.y = y.current + drop;

    if (mat.current) {
      const glow = active ? 0.45 + Math.sin(now * 4) * 0.12 : hover ? 0.22 : Math.max(0, -wave) * 1.2;
      mat.current.emissiveIntensity = THREE.MathUtils.damp(mat.current.emissiveIntensity, glow, 10, dt);
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
      visible={false}
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

function Board({
  skills,
  active,
  entered,
  ripple,
  onPress,
}: {
  skills: Skill[];
  active: number;
  entered: boolean;
  ripple: MutableRefObject<Ripple>;
  onPress: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const base = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const rows = Math.ceil(skills.length / COLS);
  const enterT = useRef(0);
  const target = useMemo(() => new THREE.Color("#6d4dff"), []);

  useEffect(() => {
    const hex = active >= 0 ? icons[skills[active].icon]?.hex : undefined;
    target.set(hex && luminance(hex) > 0.02 ? `#${hex}` : "#6d4dff");
  }, [active, skills, target]);

  useFrame((state, dt) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    const now = state.clock.elapsedTime;
    if (entered) enterT.current = Math.min(1, enterT.current + dt / 1.4);
    const e = 1 - Math.pow(1 - enterT.current, 3);
    // the whole board swings into its resting pose while the keys land
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.1 - y * 0.15, 4, dt);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -x * 0.1, 4, dt);
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      -0.5 + x * 0.25 + Math.sin(now * 0.4) * 0.06 + (1 - e) * 1.6,
      4,
      dt,
    );
    group.current.position.y = Math.sin(now * 0.8) * 0.08 - (1 - e) * 1.2;
    if (base.current) base.current.scale.setScalar(0.6 + 0.4 * e);
    // light takes the color of the selected technology
    if (light.current) light.current.color.lerp(target, 1 - Math.exp(-dt * 5));
  });

  return (
    <group ref={group} rotation={[0.1, 1.1, 0]}>
      <RoundedBox
        ref={base}
        args={[COLS * GAP + 0.35, 0.4, rows * GAP + 0.35]}
        radius={0.2}
        smoothness={4}
        position={[0, -0.18, 0]}
        receiveShadow
      >
        <meshPhysicalMaterial color="#0e0d14" roughness={0.3} metalness={0.5} clearcoat={0.6} />
      </RoundedBox>
      <pointLight ref={light} position={[0, 2.2, 0.5]} intensity={18} distance={9} color="#6d4dff" />
      {skills.map((s, i) => (
        <Key
          key={s.icon}
          skill={s}
          index={i}
          rows={rows}
          active={active === i}
          entered={entered}
          ripple={ripple}
          onPress={onPress}
        />
      ))}
    </group>
  );
}

/** Keeps the shared clock readable from outside the render loop. */
function Clock({ clock }: { clock: MutableRefObject<number> }) {
  useFrame((s) => {
    clock.current = s.clock.elapsedTime;
  });
  return null;
}

export default function Keyboard3D({ skills, onChange }: { skills: Skill[]; onChange: (i: number) => void }) {
  const [active, setActive] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const ripple = useRef<Ripple>({ index: 0, time: -10 });
  const clock = useRef(0);
  const lastUser = useRef(-10);

  // Render only while on screen; start the entrance once it is well inside the viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.intersectionRatio > 0.45) setEntered(true);
      },
      { rootMargin: "200px 0px", threshold: [0, 0.45, 0.6] },
    );
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const press = (i: number, user = true) => {
    if (user) lastUser.current = clock.current;
    ripple.current = { index: i, time: clock.current };
    setActive(i);
    onChange(i);
  };

  // Demo mode: types by itself until the visitor takes over, resumes after a pause
  useEffect(() => {
    if (!visible || !entered) return;
    let last = -1;
    const id = window.setInterval(() => {
      if (clock.current - lastUser.current < 6) return;
      let i = Math.floor(Math.random() * skills.length);
      if (i === last) i = (i + 1) % skills.length;
      last = i;
      press(i, false);
    }, 2300);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, entered, skills]);

  // Physical keyboard: first letter of the skill, otherwise a random key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      const matches = skills
        .map((s, i) => [s, i] as const)
        .filter(([s]) => s.name.toLowerCase().startsWith(e.key.toLowerCase()));
      const pick = matches.length
        ? matches[Math.floor(Math.random() * matches.length)][1]
        : Math.floor(Math.random() * skills.length);
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
        <Clock clock={clock} />
        <ambientLight intensity={0.35} />
        <spotLight position={[4, 9, 5]} angle={0.5} penumbra={0.8} intensity={70} castShadow />
        <pointLight position={[-5, 2, -2]} intensity={45} color="#6d4dff" />
        {/* Soft studio reflections for the glossy caps (no external HDR files) */}
        <Environment resolution={128}>
          <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
          <Lightformer intensity={1.5} color="#6d4dff" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
          <Lightformer intensity={0.8} position={[5, 1, 3]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
        </Environment>
        <Board skills={skills} active={active} entered={entered} ripple={ripple} onPress={press} />
        <Sparkles count={40} scale={[9, 3, 7]} position={[0, 1.2, 0]} size={2.5} speed={0.3} opacity={0.5} color="#a995ff" />
        <ContactShadows position={[0, -0.6, 0]} opacity={0.65} scale={14} blur={2.6} far={3} color="#000000" />
      </Canvas>
    </div>
  );
}
