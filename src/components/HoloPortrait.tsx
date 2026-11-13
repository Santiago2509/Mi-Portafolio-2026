"use client";
import { Component, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { holo } from "@/lib/holo";

const SRC = "/images/hero-holo.webp";
const ASPECT = 843 / 1264; // width / height of the portrait
const PLANE_H = 2;
const PLANE_W = PLANE_H * ASPECT;
// centre of the face on the portrait plane, and the radius that covers the whole plane
export const FACE_X = 0.03;
export const FACE_Y = 0.2;
export const MAX_R = 1.65;

type Sampled = {
  positions: Float32Array;
  lum: Float32Array;
  depth: Float32Array;
  alpha: Float32Array;
  rand: Float32Array;
  photo: THREE.Texture;
  depthMap: THREE.Texture;
};

/** Reads the portrait into point attributes + a soft depth map (brightness + head bump). */
function sample(img: HTMLImageElement, cols: number): Sampled {
  const rows = Math.round(cols / ASPECT);
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, cols, rows);
  const px = g.getImageData(0, 0, cols, rows).data;

  // blurred copy → smooth relief
  const b = document.createElement("canvas");
  b.width = cols;
  b.height = rows;
  const bg = b.getContext("2d", { willReadFrequently: true })!;
  bg.filter = "blur(5px)";
  bg.drawImage(img, 0, 0, cols, rows);
  const bpx = bg.getImageData(0, 0, cols, rows).data;

  const depthAt = (i: number, j: number) => {
    const k = (j * cols + i) * 4;
    const l = (bpx[k] + bpx[k + 1] + bpx[k + 2]) / 765;
    const u = i / cols;
    const v = j / rows;
    const bump = Math.exp(-(((u - 0.52) / 0.24) ** 2 + ((v - 0.4) / 0.3) ** 2));
    return l * 0.55 + bump * 0.6;
  };

  const depthData = new Uint8Array(cols * rows * 4);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const k = ((rows - 1 - j) * cols + i) * 4; // stored bottom-up to match UVs
      depthData[k] = Math.min(255, depthAt(i, j) * 255);
      depthData[k + 3] = 255;
    }
  const depthMap = new THREE.DataTexture(depthData, cols, rows, THREE.RGBAFormat);
  depthMap.minFilter = depthMap.magFilter = THREE.LinearFilter;
  depthMap.needsUpdate = true;

  const P: number[] = [];
  const L: number[] = [];
  const D: number[] = [];
  const A: number[] = [];
  const R: number[] = [];
  // every 2nd row → reads as contour lines, like a scanned head
  for (let j = 0; j < rows; j += 2)
    for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 4;
      const a = px[k + 3] / 255;
      if (a < 0.06) continue;
      P.push((i / cols - 0.5) * PLANE_W, (0.5 - j / rows) * PLANE_H, 0);
      L.push((px[k] + px[k + 1] + px[k + 2]) / 765);
      D.push(depthAt(i, j));
      A.push(a);
      R.push(Math.random(), Math.random(), Math.random());
    }

  const photo = new THREE.Texture(img);
  photo.colorSpace = THREE.SRGBColorSpace;
  photo.needsUpdate = true;

  return {
    positions: new Float32Array(P),
    lum: new Float32Array(L),
    depth: new Float32Array(D),
    alpha: new Float32Array(A),
    rand: new Float32Array(R),
    photo,
    depthMap,
  };
}

const MASK_GLSL = /* glsl */ `
  uniform float uReveal;
  const vec2 FACE = vec2(${FACE_X.toFixed(3)}, ${FACE_Y.toFixed(3)});
  // The human side opens as a circle from the centre of the face (like a drop
  // hitting water) and grows with the scroll until it covers the whole portrait.
  float waveR() { return uReveal * ${MAX_R.toFixed(2)}; }
  float faceDist(vec2 p) { return distance(p, FACE); }
  // 1 = human photo, 0 = hologram
  float humanMask(vec2 p) {
    return 1.0 - smoothstep(waveR() - 0.025, waveR() + 0.025, faceDist(p));
  }
`;

const pointsVert = /* glsl */ `
  ${MASK_GLSL}
  uniform float uTime;
  uniform float uAssemble;
  uniform float uDepth;
  uniform float uSize;
  attribute float aLum;
  attribute float aDepth;
  attribute float aAlpha;
  attribute vec3 aRand;
  varying float vA;
  varying float vLum;
  void main() {
    vec3 p = position;
    p.z = aDepth * uDepth;

    // fly in from a scattered cloud
    float t = clamp((uAssemble - aRand.y * 0.4) / 0.6, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    vec3 cloud = p + (aRand - 0.5) * vec3(3.4, 3.0, 2.6) + vec3(0.0, -0.5, 0.0);
    p = mix(cloud, p, t);

    float mask = humanMask(position.xy);
    // travelling highlight + the hologram lines light up right at the wave front
    float band = 1.0 - smoothstep(0.0, 0.07, abs(position.y - (1.15 - mod(uTime * 0.42, 2.9))));
    float front = (1.0 - smoothstep(0.0, 0.12, abs(faceDist(position.xy) - waveR()))) * step(0.002, uReveal);
    vLum = aLum + band * 0.7 + front * 1.2;
    vA = aAlpha * (1.0 - mask) * t * (0.42 + aLum * 0.95 + band * 0.5 + front * 0.8);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aLum * 1.1 + band * 0.7 + front * 0.6) / -mv.z;
  }
`;

const pointsFrag = /* glsl */ `
  varying float vA;
  varying float vLum;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = (1.0 - smoothstep(0.08, 0.5, d)) * vA;
    vec3 violet = vec3(0.45, 0.31, 1.0);
    vec3 col = mix(violet, vec3(1.0), smoothstep(0.18, 0.85, vLum));
    gl_FragColor = vec4(col, a);
  }
`;

const photoVert = /* glsl */ `
  uniform sampler2D uDepthMap;
  uniform float uDepth;
  varying vec2 vUv;
  varying vec2 vP;
  void main() {
    vUv = uv;
    vP = position.xy;
    vec3 p = position;
    p.z = texture2D(uDepthMap, uv).r * uDepth;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const photoFrag = /* glsl */ `
  ${MASK_GLSL}
  uniform sampler2D uMap;
  uniform float uAssemble;
  varying vec2 vUv;
  varying vec2 vP;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float mask = humanMask(vP);
    // glow on the scan front
    float front = (1.0 - smoothstep(0.0, 0.03, abs(faceDist(vP) - waveR()))) * step(0.002, uReveal) * step(uReveal, 0.985);
    vec3 col = tex.rgb + front * 0.7 * vec3(0.62, 0.5, 1.0);
    float a = tex.a * mask * smoothstep(0.6, 1.0, uAssemble);
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

function Scene({
  data,
  ready,
  revealRef,
  mobile,
}: {
  data: Sampled;
  ready: boolean;
  revealRef: MutableRefObject<number>;
  mobile: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { camera, size, gl } = useThree();
  const assemble = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAssemble: { value: 0 },
      uReveal: { value: 0 },
      uDepth: { value: 0.42 },
      uSize: { value: 10 },
      uMap: { value: data.photo },
      uDepthMap: { value: data.depthMap },
    }),
    [data],
  );

  // Materials are created by hand so both share the very same uniform objects
  // (R3F clones a `uniforms` prop, which would break the per-frame updates).
  const pointsMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: pointsVert,
        fragmentShader: pointsFrag,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  );
  const photoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: photoVert,
        fragmentShader: photoFrag,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    [uniforms],
  );

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute("aLum", new THREE.BufferAttribute(data.lum, 1));
    g.setAttribute("aDepth", new THREE.BufferAttribute(data.depth, 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(data.alpha, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(data.rand, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
    return g;
  }, [data]);

  // Fit: portrait anchored to the bottom, taking a fraction of the viewport height
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vAspect = size.width / size.height;
    // The image has empty margin above the hair and a faded torso below, so it is
    // drawn taller than the viewport: the head lands just under the nav.
    let frac = mobile ? 0.9 : 1.14;
    // don't let it get wider than the viewport on narrow screens
    frac = Math.min(frac, (vAspect * 1.3) / ASPECT);
    const visible = PLANE_H / frac;
    cam.position.set(0, 0, visible / 2 / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)));
    cam.updateProjectionMatrix();
    // plane top sits `lift` above the top edge of the viewport (mobile: lower, under the big word)
    const lift = mobile ? -0.2 : 0.045;
    if (group.current) group.current.position.y = visible / 2 + lift * visible - PLANE_H / 2;
    // where the face centre lands on screen, so the page-wide wave starts exactly there
    holo.unit = (frac * size.height) / PLANE_H;
    holo.cx = size.width / 2 + FACE_X * holo.unit;
    holo.cy = -lift * size.height + (PLANE_H / 2 - FACE_Y) * holo.unit;
    holo.maxR = MAX_R;
    uniforms.uSize.value = size.height * gl.getPixelRatio() * (mobile ? 0.0135 : 0.0125);
  }, [camera, size, gl, mobile, uniforms]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    if (ready) assemble.current = Math.min(1, assemble.current + dt / 2.4);
    uniforms.uAssemble.value = assemble.current;
    uniforms.uReveal.value = THREE.MathUtils.damp(uniforms.uReveal.value, revealRef.current, 8, dt);
  });

  return (
    <group ref={group}>
      <points geometry={geo} frustumCulled={false}>
        <primitive object={pointsMat} attach="material" />
      </points>
      <mesh renderOrder={2}>
        <planeGeometry args={[PLANE_W, PLANE_H, 96, 144]} />
        <primitive object={photoMat} attach="material" />
      </mesh>
      <Sparkles count={mobile ? 30 : 70} scale={[4.2, 2.6, 2]} position={[0, 0.1, 0.2]} size={2.2} speed={0.35} opacity={0.55} color="#a995ff" />
    </group>
  );
}

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function HoloPortrait({
  ready,
  revealRef,
  eventSource,
}: {
  ready: boolean;
  revealRef: MutableRefObject<number>;
  eventSource: HTMLElement;
}) {
  const [data, setData] = useState<Sampled | null>(null);
  const [visible, setVisible] = useState(true);
  const [mobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const img = new Image();
    img.src = SRC;
    img.decode().then(() => setData(sample(img, mobile ? 210 : 300))).catch((e) => console.error('holo', e));
  }, [mobile]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(eventSource);
    return () => io.disconnect();
  }, [eventSource]);

  // eslint-disable-next-line @next/next/no-img-element
  const fallback = <img src={SRC} alt="" className="absolute bottom-0 left-1/2 h-[88%] -translate-x-1/2 object-contain" />;

  return (
    <Boundary fallback={fallback}>
      <Canvas
        className="!absolute inset-0"
        style={{ pointerEvents: "none" }}
        dpr={[1, mobile ? 1.5 : 1.75]}
        camera={{ fov: 30, near: 0.1, far: 50, position: [0, 0, 4] }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        {data && <Scene data={data} ready={ready} revealRef={revealRef} mobile={mobile} />}
      </Canvas>
    </Boundary>
  );
}
