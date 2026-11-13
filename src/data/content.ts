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

// Teclas del teclado 3D: "icon" es el nombre en src/data/icons.ts
export const skills = [
  { icon: "javascript", name: "JavaScript", line: "El idioma con el que pienso." },
  { icon: "typescript", name: "TypeScript", line: "Tipos que me salvan a las 3 a.m." },
  { icon: "react", name: "React", line: "Componentes con alma." },
  { icon: "nextjs", name: "Next.js", line: "Rápido, SEO y a producción." },
  { icon: "node", name: "Node.js", line: "El backend también es mío." },
  { icon: "html", name: "HTML5", line: "La base de todo lo que construyo." },
  { icon: "css", name: "CSS", line: "Píxeles exactamente en su sitio." },
  { icon: "tailwind", name: "Tailwind CSS", line: "Estilos a la velocidad de la idea." },
  { icon: "gsap", name: "GSAP", line: "Movimiento con intención." },
  { icon: "three", name: "Three.js", line: "Profundidad en el navegador." },
  { icon: "figma", name: "Figma", line: "Donde nace cada idea." },
  { icon: "git", name: "Git", line: "Cada cambio, bajo control." },
  { icon: "github", name: "GitHub", line: "Mi código, a la vista." },
  { icon: "python", name: "Python", line: "Scripts, datos y automatización." },
  { icon: "mysql", name: "MySQL", line: "Datos ordenados, decisiones claras." },
  { icon: "mongodb", name: "MongoDB", line: "Datos flexibles para apps flexibles." },
  { icon: "firebase", name: "Firebase", line: "Del prototipo a producción en horas." },
  { icon: "docker", name: "Docker", line: "Funciona en mi máquina… y en todas." },
  { icon: "vite", name: "Vite", line: "Arranque instantáneo." },
  { icon: "vercel", name: "Vercel", line: "Deploy en un git push." },
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
