// ============================================================
//  CONTENIDO DEL PORTAFOLIO
//  Edita aquí tus textos, proyectos, skills y contacto.
//  Los valores marcados con "TODO" son provisionales.
// ============================================================

export const profile = {
  name: "Santiago",
  lastName: "", // TODO: tu apellido si quieres mostrarlo
  heroWord: "SANTIAGO",
  role: "Desarrollador & Diseñador Creativo", // TODO
  tagline:
    "Construyo experiencias digitales con actitud: código limpio, diseño que se siente y animaciones que no se olvidan.",
  location: "Colombia", // TODO
  available: true,
  email: "hola@tudominio.com", // TODO
  phone: "", // TODO
  socials: [
    { label: "GitHub", href: "https://github.com/santiago2509" },
    { label: "LinkedIn", href: "#" }, // TODO
    { label: "Instagram", href: "#" }, // TODO
  ],
};

export const stats = [
  { value: 3, suffix: "+", label: "Años creando" }, // TODO
  { value: 20, suffix: "+", label: "Proyectos" }, // TODO
  { value: 100, suffix: "%", label: "Actitud" },
];

export const about = {
  kicker: "Así soy yo",
  statement:
    "Sin gafas, sin pose. Soy alguien que se obsesiona con los detalles, que aprende rápido y que convierte ideas en productos reales. Me gusta que lo que hago se vea bien, pero sobre todo que funcione.",
  facts: [
    { k: "Base", v: "Colombia" }, // TODO
    { k: "Enfoque", v: "Web · UI · Motion" },
    { k: "Ahora", v: "Abierto a proyectos" },
  ],
};

export type Project = {
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  href?: string;
  image?: string; // ruta en /public/images/projects/...
  accent: string; // color del visual provisional
};

// TODO: reemplaza por tus proyectos reales
export const projects: Project[] = [
  {
    title: "Nocturna",
    category: "E-commerce",
    year: "2026",
    description: "Tienda de moda urbana con checkout rápido y catálogo animado.",
    tags: ["Next.js", "Stripe", "GSAP"],
    accent: "#e10600",
  },
  {
    title: "Pulse",
    category: "Dashboard",
    year: "2025",
    description: "Panel de métricas en tiempo real con visualizaciones a medida.",
    tags: ["React", "D3", "Node"],
    accent: "#ff5a1f",
  },
  {
    title: "Eclipse",
    category: "Landing 3D",
    year: "2025",
    description: "Lanzamiento de producto con escena 3D interactiva en el navegador.",
    tags: ["Three.js", "R3F", "Blender"],
    accent: "#b0001a",
  },
  {
    title: "Ritmo",
    category: "App móvil",
    year: "2024",
    description: "App para descubrir eventos y música en tu ciudad.",
    tags: ["React Native", "Firebase"],
    accent: "#ff2a1f",
  },
];

// Teclas del teclado 3D (texto corto + frase al pulsarla)
export const skills = [
  { key: "JS", name: "JavaScript", line: "El idioma con el que pienso." },
  { key: "TS", name: "TypeScript", line: "Tipos que me salvan a las 3 a.m." },
  { key: "React", name: "React", line: "Componentes con alma." },
  { key: "Next", name: "Next.js", line: "Rápido, SEO y a producción." },
  { key: "Node", name: "Node.js", line: "El backend también es mío." },
  { key: "CSS", name: "CSS / Tailwind", line: "Píxeles en su sitio." },
  { key: "GSAP", name: "GSAP", line: "Movimiento con intención." },
  { key: "3D", name: "Three.js", line: "Profundidad en el navegador." },
  { key: "Figma", name: "Figma", line: "Donde nace cada idea." },
  { key: "Git", name: "Git", line: "Cada cambio, bajo control." },
  { key: "SQL", name: "SQL", line: "Datos ordenados, decisiones claras." },
  { key: "Py", name: "Python", line: "Scripts, datos y automatización." },
]; // TODO: ajusta a tus tecnologías

// Píldoras con física (lo que hago)
export const services = [
  "Desarrollo web",
  "UI Design",
  "Animaciones",
  "Landing pages",
  "E-commerce",
  "Experiencias 3D",
  "Branding digital",
  "Responsive",
  "Performance",
  "Prototipos",
];

export const workProcess = [
  { title: "Descubrir", text: "Entiendo el objetivo, la audiencia y lo que hace falta." },
  { title: "Idear", text: "Bocetos, estructura y la idea que lo hace distinto." },
  { title: "Diseñar", text: "Interfaces con carácter, pensadas para usarse." },
  { title: "Desarrollar", text: "Código rápido, accesible y responsive." },
  { title: "Lanzar", text: "Pruebo, optimizo y lo pongo en el mundo." },
];

// TODO: tu experiencia / estudios reales
export const timeline = [
  { period: "2025 — Ahora", title: "Desarrollador Freelance", place: "Independiente", now: true },
  { period: "2023 — 2025", title: "Estudios en Desarrollo de Software", place: "Tu institución" },
  { period: "2023", title: "Certificación UI/UX", place: "Plataforma online" },
];

export const quote = {
  text: "El buen diseño no es solo cómo se ve, es cómo se siente.",
  signature: "Santiago",
};
