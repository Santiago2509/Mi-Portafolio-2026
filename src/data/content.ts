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
  features: string[];
  tags: string[];
  href?: string; // sitio en vivo
  repo?: string; // código en GitHub
  image?: string; // miniatura en /public/images/projects/...
  accent: string; // color de la miniatura generada (si no hay imagen)
};

// Proyectos principales (con sitio en vivo)
export const projects: Project[] = [
  {
    title: "Floristería Violeta",
    category: "E-commerce · Cali",
    year: "2026",
    description:
      "Sitio web para una floristería de Cali: catálogo de arreglos florales con pedidos directos por WhatsApp y un panel para que la tienda gestione todo sola.",
    features: [
      "Catálogo inteligente por ocasión",
      "Panel de administración",
      "Subir y destacar productos",
      "SEO para aparecer en Google",
    ],
    tags: ["Next.js", "TypeScript", "Supabase", "Cloudinary", "Tailwind"],
    href: "https://web-floristeria-violeta.vercel.app",
    image: "/images/projects/floristeria-violeta.webp",
    accent: "#8b5cf6",
  },
  {
    title: "AirPods Nariño",
    category: "E-commerce · Pasto",
    year: "2026",
    description:
      "Tienda de accesorios Apple con garantía directa en Pasto y todo Nariño, con catálogo administrable y una contabilidad privada para el negocio.",
    features: [
      "Catálogo inteligente",
      "Panel de administración",
      "Contabilidad privada básica",
      "SEO para aparecer en Google",
    ],
    tags: ["Next.js", "TypeScript", "Supabase", "Zustand", "Tailwind"],
    href: "https://airpodsnarinoweb.vercel.app",
    image: "/images/projects/airpods-narino.webp",
    accent: "#3b82f6",
  },
  {
    title: "Libre de Ansiedad",
    category: "Plataforma de membresías",
    year: "2026",
    description:
      "Plataforma para la clínica Libre de Ansiedad que vende membresías y cobra automáticamente a cada cliente mes a mes, con un aula virtual para los suscriptores.",
    features: [
      "Cobros recurrentes automáticos",
      "Pagos con ePayco",
      "Aula virtual para suscriptores",
      "Panel de suscriptores y contenido",
    ],
    tags: ["Next.js", "TypeScript", "Supabase", "ePayco"],
    href: "https://membresia-lda.vercel.app",
    image: "/images/projects/libre-de-ansiedad.webp",
    accent: "#0ea5e9",
  },
];

// Otros proyectos (sección "Ver más")
export const moreProjects: (Pick<Project, "title" | "category" | "description" | "tags" | "href" | "repo"> & {
  team?: boolean;
})[] = [
  {
    title: "CreatorCV",
    category: "App web con IA",
    description: "Editor de hojas de vida con plantillas, vista previa en tiempo real, exportación a PDF y un asistente de IA para redactar.",
    tags: ["React", "Supabase", "Spring Boot", "IA"],
    repo: "https://github.com/Santiago25-lab/creator-frontend",
  },
  {
    title: "Observability Hub",
    category: "Monitoreo de microservicios",
    description: "Panel que monitorea microservicios a través de un proxy de auditoría, con métricas en vivo y gráficas.",
    tags: ["Java 21", "Spring Boot", "React", "Recharts"],
    href: "https://tallerproxy.vercel.app",
    repo: "https://github.com/Santiago2509/Taller-proxy",
  },
  {
    title: "Catálogo de Joyas 3D",
    category: "Visor 3D interactivo",
    description: "Catálogo de joyería donde cada pieza se gira 360°, se acerca al detalle y cambia de metal en tiempo real.",
    tags: ["React", "TypeScript", "Three.js"],
    repo: "https://github.com/Santiago2509/Modelo-joyas-",
  },
  {
    title: "Clickeable",
    category: "Juego educativo",
    description: "Minijuegos para aprender a reconocer estafas digitales, enlaces maliciosos y phishing antes de hacer clic.",
    tags: ["Angular", "TypeScript"],
    repo: "https://github.com/davidluna301/Clickable",
    team: true,
  },
  {
    title: "Proyecto Ares",
    category: "Backend en Java",
    description: "Simulación por turnos de colonias humanas en Marte: módulos, tripulación, recursos, robots y emergencias.",
    tags: ["Java", "POO"],
    repo: "https://github.com/Santiago2509/Proyecto-Ares",
    team: true,
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
    progress: { done: 6, total: 8, unit: "semestre" },
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
