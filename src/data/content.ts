// ============================================================
//  CONTENIDO DEL PORTAFOLIO
//  Edita aquí tus textos, proyectos, skills y contacto.
//  Los valores marcados con "TODO" son provisionales.
// ============================================================

export const profile = {
  name: "Santiago",
  lastName: "", // TODO: tu apellido si quieres mostrarlo
  heroWord: "SANTIAGO",
  role: "Ingeniero de Software",
  // Habilidades complementarias (se muestran como línea secundaria)
  specialties: ["Full-stack", "Web", "UI", "3D"],
  tagline:
    "Creo páginas y aplicaciones web de principio a fin: desde la idea y el diseño hasta el código que las hace funcionar.",
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

// Se muestran en la sección "Experiencia"
export const stats = [
  { value: 3, suffix: "", label: "Años programando" }, // desde 2024
  { value: 30, suffix: "+", label: "Proyectos construidos" }, // TODO: confirma la cifra
  { value: 50, suffix: "+", label: "Tecnologías" },
];

export const about = {
  kicker: "Sobre mí",
  statement:
    "Hola, soy Santiago. Soy ingeniero de software y me dedico a crear páginas y aplicaciones web de principio a fin: desde la idea y el diseño hasta el código que las hace funcionar. Me encanta aprender algo nuevo cada día y construir cosas que de verdad le sirvan a la gente.",
  // palabras resaltadas en el texto
  highlight: ["ingeniero", "software", "aplicaciones", "web", "sirvan"],
  facts: [
    { k: "Estudio", v: "Ingeniería de Software · 6.º semestre" },
    { k: "Enfoque", v: "Desarrollo web full-stack" },
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
    accent: "#6d4dff",
  },
  {
    title: "Pulse",
    category: "Dashboard",
    year: "2025",
    description: "Panel de métricas en tiempo real con visualizaciones a medida.",
    tags: ["React", "D3", "Node"],
    accent: "#3b82f6",
  },
  {
    title: "Eclipse",
    category: "Landing 3D",
    year: "2025",
    description: "Lanzamiento de producto con escena 3D interactiva en el navegador.",
    tags: ["Three.js", "R3F", "Blender"],
    accent: "#8b5cf6",
  },
  {
    title: "Ritmo",
    category: "App móvil",
    year: "2024",
    description: "App para descubrir eventos y música en tu ciudad.",
    tags: ["React Native", "Firebase"],
    accent: "#4f46e5",
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
  "Arquitectura de software",
  "Full-stack",
  "APIs & Backend",
  "Bases de datos",
  "Cloud & Deploy",
  "Testing",
  "Performance",
  "UI Design",
  "Animaciones",
  "Experiencias 3D",
];

// TODO: tu experiencia y estudios reales
export const timeline: {
  period: string;
  title: string;
  place: string;
  now?: boolean;
  text: string;
  tags: string[];
  progress?: { done: number; total: number; unit: string };
}[] = [
  {
    period: "2024 — Actualidad",
    title: "Ingeniería de Software",
    place: "Universidad Cooperativa de Colombia",
    now: true,
    text: "Pregrado en curso. Formación en programación, algoritmos y estructuras de datos, bases de datos, arquitectura de software y gestión de proyectos.",
    tags: ["Pregrado", "En curso"],
    progress: { done: 6, total: 9, unit: "semestre" },
  },
  {
    period: "2025 — Actualidad",
    title: "Tecnólogo en Análisis y Desarrollo de Software",
    place: "Formación tecnológica", // TODO: nombre de la institución
    now: true,
    text: "Formación práctica en análisis de requisitos, desarrollo de aplicaciones, bases de datos y metodologías ágiles, trabajando en proyectos reales.",
    tags: ["Tecnología", "En curso"],
  },
];

// Todas las herramientas (sección "Ver todas"). "icon" = nombre en src/data/icons.ts
// TODO: deja solo las que usas de verdad
export const toolbox = [
  { category: "Lenguajes", items: ["javascript", "typescript", "python", "java", "cpp", "csharp", "kotlin", "php", "go"] },
  { category: "Frontend", items: ["react", "nextjs", "html", "css", "tailwind", "sass", "redux", "vue", "angular", "gsap", "three", "framer"] },
  { category: "Backend", items: ["node", "express", "nestjs", "spring", "django", "fastapi", "laravel", "graphql"] },
  { category: "Bases de datos", items: ["mysql", "postgresql", "mongodb", "redis", "sqlite", "firebase", "supabase", "prisma"] },
  { category: "Cloud & DevOps", items: ["docker", "kubernetes", "githubactions", "nginx", "vercel", "googlecloud", "linux"] },
  { category: "Herramientas", items: ["git", "github", "figma", "postman", "jest", "vite", "npm", "jira", "notion", "swagger"] },
];
