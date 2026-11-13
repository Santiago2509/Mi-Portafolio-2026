import {
  siJavascript, siTypescript, siReact, siNextdotjs, siNodedotjs, siHtml5, siCss, siTailwindcss,
  siGsap, siThreedotjs, siFigma, siGit, siGithub, siPython, siMysql, siMongodb, siFirebase,
  siDocker, siVite, siVercel, siOpenjdk, siCplusplus, siSharp, siKotlin, siPhp, siGo, siSass,
  siRedux, siVuedotjs, siAngular, siFramer, siExpress, siNestjs, siSpring, siDjango, siFastapi,
  siLaravel, siGraphql, siPostgresql, siRedis, siSqlite, siSupabase, siPrisma, siKubernetes,
  siGithubactions, siNginx, siGooglecloud, siLinux, siPostman, siJest, siNpm, siJira, siNotion,
  siSwagger,
} from "simple-icons";

export type Icon = { path: string; hex: string; title: string };

// Logos (simple-icons, CC0) por nombre corto
export const icons: Record<string, Icon> = {
  javascript: siJavascript,
  typescript: siTypescript,
  python: siPython,
  java: { ...siOpenjdk, title: "Java" },
  cpp: siCplusplus,
  csharp: { ...siSharp, title: "C#", hex: "512BD4" },
  kotlin: siKotlin,
  php: siPhp,
  go: siGo,
  react: siReact,
  nextjs: siNextdotjs,
  html: siHtml5,
  css: siCss,
  tailwind: siTailwindcss,
  sass: siSass,
  redux: siRedux,
  vue: siVuedotjs,
  angular: siAngular,
  gsap: siGsap,
  three: siThreedotjs,
  framer: siFramer,
  node: siNodedotjs,
  express: siExpress,
  nestjs: siNestjs,
  spring: siSpring,
  django: siDjango,
  fastapi: siFastapi,
  laravel: siLaravel,
  graphql: siGraphql,
  mysql: siMysql,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  redis: siRedis,
  sqlite: siSqlite,
  firebase: siFirebase,
  supabase: siSupabase,
  prisma: siPrisma,
  docker: siDocker,
  kubernetes: siKubernetes,
  githubactions: siGithubactions,
  nginx: siNginx,
  vercel: siVercel,
  googlecloud: siGooglecloud,
  linux: siLinux,
  git: siGit,
  github: siGithub,
  figma: siFigma,
  postman: siPostman,
  jest: siJest,
  vite: siVite,
  npm: siNpm,
  jira: siJira,
  notion: siNotion,
  swagger: siSwagger,
};

/** Color legible sobre fondo oscuro (las marcas negras pasan a blanco). */
export function brandOnDark(hex: string) {
  const n = parseInt(hex, 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum < 0.28 ? "#f1eff7" : `#${hex}`;
}
