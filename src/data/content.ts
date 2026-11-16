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
  email: "santiagourbina2509@gmail.com",
  phone: "", // TODO
  github: [
    { label: "@Santiago2509", href: "https://github.com/Santiago2509" },
    { label: "@Santiago25-lab", href: "https://github.com/Santiago25-lab" },
  ],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/santiago-urbina-172371339", icon: "linkedin" },
    { label: "Instagram", href: "https://www.instagram.com/santiagou2_9", icon: "instagram" },
    { label: "TikTok", href: "https://www.tiktok.com/@edwinsantiagourbi", icon: "tiktok" },
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
    title: "Jornal 360",
    category: "Sistema de nómina y personal",
    year: "2026",
    description:
      "Sistema completo de administración de personal y liquidación de nómina para empresas: empleados, asistencia, novedades, prestaciones y retiros en un solo lugar.",
    features: [
      "Liquidación de nómina",
      "Asistencia y novedades",
      "Prestaciones y retiros",
      "Reportes y auditoría",
    ],
    tags: ["Next.js", "React", "TypeScript", "Tailwind", "Recharts"],
    href: "https://jornal360-frontend.vercel.app",
    repo: "https://github.com/Santiago25-lab/jornal360-frontend",
    image: "/images/projects/jornal360.webp",
    accent: "#8b5cf6",
  },
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
  {
    title: "CreatorCV",
    category: "Creador de hojas de vida con IA",
    year: "2026",
    description:
      "Crea hojas de vida a la medida de forma rápida y fácil: muchas plantillas, edición en tiempo real y un asistente de inteligencia artificial que ayuda a redactar.",
    features: [
      "Asistente de IA para redactar",
      "Múltiples plantillas",
      "Vista previa en tiempo real",
      "Exportación a PDF",
    ],
    tags: ["React", "Supabase", "Spring Boot", "IA"],
    href: "https://creator-frontend-mu.vercel.app",
    repo: "https://github.com/Santiago25-lab/creator-frontend",
    image: "/images/projects/creatorcv.webp",
    accent: "#a855f7",
  },
  {
    title: "Atelier · Joyas 3D",
    category: "Catálogo con visor 3D",
    year: "2026",
    description:
      "Catálogo de alta joyería donde cada pieza se ve en 3D: se gira 360°, se acerca hasta el detalle y cambia de metal en tiempo real, con gemas que refractan la luz.",
    features: [
      "Visor 3D interactivo 360°",
      "Oro amarillo, blanco o rosa al instante",
      "Gemas con refracción realista",
      "Funciona en móvil y escritorio",
    ],
    tags: ["React", "TypeScript", "Three.js", "R3F"],
    href: "https://modelo-joyas.vercel.app",
    repo: "https://github.com/Santiago2509/Modelo-joyas-",
    image: "/images/projects/joyas-3d.webp",
    accent: "#d4a853",
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
    title: "MUSIC2D",
    category: "Reproductor de música",
    year: "2026",
    description:
      "Reproductor de música con estilo retro: tocadiscos animado, subida de MP3 propios, búsqueda de canciones en la nube y una vista 3D de portadas.",
    features: [
      "Sube y reproduce tus MP3",
      "Búsqueda de canciones en la nube",
      "Vista 3D CoverFlow y modo grafo",
      "Listas con estructuras de datos propias",
    ],
    tags: ["TypeScript", "Vite", "IndexedDB"],
    href: "https://reproductor-musica-eight.vercel.app",
    image: "/images/projects/music2d.webp",
    accent: "#64748b",
  },
];

// Otros proyectos (sección "Ver más")
export const moreProjects: (Pick<Project, "title" | "category" | "description" | "tags" | "href" | "repo"> & {
  team?: boolean;
})[] = [
  {
    title: "Verifica Santa Fe",
    category: "Bot anti-phishing",
    description: "Bot de WhatsApp y Telegram que revisa mensajes, enlaces y capturas sospechosas y responde con un semáforo de riesgo para comerciantes.",
    tags: ["Next.js", "Supabase", "OCR", "Bots"],
    href: "https://lab-bot-verifica-santa-fe.vercel.app",
    repo: "https://github.com/Santiago25-lab/lab-bot-verifica-santa-fe",
  },
  {
    title: "StaffFlow RH",
    category: "Recursos humanos",
    description: "Plataforma de RR. HH. para empresas colombianas: empleados, vacaciones, novedades, asistencia con QR y costos laborales.",
    tags: ["React", "Vite", "Node.js", "Tailwind"],
    href: "https://getvac-la-lujosa.vercel.app",
    repo: "https://github.com/Santiago25-lab/getvac-la-lujosa",
  },
  {
    title: "iNARIÑO",
    category: "E-commerce premium",
    description: "Tienda y asesoría tecnológica estilo Apple, con modo claro y oscuro y animaciones cinematográficas.",
    tags: ["Next.js", "Supabase", "GSAP"],
    href: "https://proyecto-giancarlo.vercel.app",
    repo: "https://github.com/Santiago25-lab/Proyecto-Giancarlo",
  },
  {
    title: "Eatyfy",
    category: "Buscador de restaurantes",
    description: "App para descubrir restaurantes en Colombia según tu presupuesto, con mapas interactivos y promociones.",
    tags: ["React", "TypeScript", "Leaflet"],
    href: "https://fronted-eatyfy1.vercel.app",
    repo: "https://github.com/Santiago25-lab/fronted-eatyfy1",
  },
  {
    title: "Reservas Hotel",
    category: "Sistema de reservas",
    description: "Aplicación de reservas de hotel con frontend en React y backend en Java.",
    tags: ["React", "TypeScript", "Java"],
    href: "https://reservas-hotel-frontend.vercel.app",
    repo: "https://github.com/Santiago25-lab/ReservasHotelFrontend",
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
  "Frontend",
  "Backend",
  "APIs REST",
  "Bases de datos",
  "Paneles de administración",
  "E-commerce",
  "Pagos en línea",
  "Cloud & Deploy",
  "SEO",
  "Responsive",
  "UI Design",
  "UX",
  "Animaciones",
  "Experiencias 3D",
  "Testing",
  "Performance",
  "Integraciones",
  "Automatización",
  "Bots",
  "Inteligencia artificial",
  "Git & CI/CD",
  "Metodologías ágiles",
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
    period: "2026",
    title: "Desarrollador Full-Stack Freelance",
    place: "Independiente",
    text: "Diseño, desarrollo y administro sistemas para clientes reales: tiendas en línea, paneles administrativos, plataformas de membresías y sistemas de gestión, desde la idea hasta el despliegue y el soporte.",
    tags: ["Clientes reales", "Full-stack", "Gestión de proyectos"],
  },
  {
    period: "2026",
    title: "Desarrollador Web",
    place: "Clínica Libre de Ansiedad",
    text: "Implementé la pasarela de pagos en el sitio WordPress de la clínica con WooCommerce para vender sus membresías en línea, y después desarrollé su plataforma propia de membresías con cobro recurrente.",
    tags: ["WordPress", "WooCommerce", "Pasarela de pagos"],
  },
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
