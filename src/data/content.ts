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
    "Diseño y construyo software de punta a punta: arquitectura sólida, código limpio y productos que la gente disfruta usar.",
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
  { value: 3, suffix: "+", label: "Años programando" }, // TODO
  { value: 20, suffix: "+", label: "Proyectos construidos" }, // TODO
  { value: 30, suffix: "+", label: "Tecnologías" },
];

export const about = {
  kicker: "Así soy yo",
  statement:
    "Sin gafas, sin pose. Soy ingeniero de software: me obsesionan los detalles, aprendo rápido y convierto problemas en productos reales. Me gusta que lo que construyo se vea bien, pero sobre todo que funcione.",
  facts: [
    { k: "Base", v: "Colombia" }, // TODO
    { k: "Profesión", v: "Ingeniero de Software" },
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
export const timeline = [
  {
    period: "2025 — Ahora",
    title: "Ingeniero de Software Freelance",
    place: "Independiente",
    now: true,
    text: "Diseño y desarrollo productos web de punta a punta: desde la arquitectura y la base de datos hasta la interfaz y el despliegue.",
    tags: ["Full-stack", "Arquitectura", "Cloud"],
  },
  {
    period: "2024 — 2025",
    title: "Desarrollador Full-stack",
    place: "Nombre de la empresa",
    text: "Construcción de APIs, integración de servicios y desarrollo de interfaces para aplicaciones en producción.",
    tags: ["APIs", "React", "SQL"],
  },
  {
    period: "2021 — 2025",
    title: "Ingeniería de Software",
    place: "Tu universidad",
    text: "Formación en ingeniería: algoritmos, estructuras de datos, bases de datos, arquitectura y gestión de proyectos de software.",
    tags: ["Pregrado"],
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
