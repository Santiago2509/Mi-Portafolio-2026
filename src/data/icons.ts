import {
  siJavascript, siTypescript, siReact, siNextdotjs, siNodedotjs, siHtml5, siCss, siTailwindcss,
  siGsap, siThreedotjs, siFigma, siGit, siGithub, siPython, siMysql, siMongodb, siFirebase,
  siDocker, siVite, siVercel,
} from "simple-icons";

export type Icon = { path: string; hex: string; title: string };

// Logos (simple-icons, CC0) por nombre corto
export const icons: Record<string, Icon> = {
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  nextjs: siNextdotjs,
  node: siNodedotjs,
  html: siHtml5,
  css: siCss,
  tailwind: siTailwindcss,
  gsap: siGsap,
  three: siThreedotjs,
  figma: siFigma,
  git: siGit,
  github: siGithub,
  python: siPython,
  mysql: siMysql,
  mongodb: siMongodb,
  firebase: siFirebase,
  docker: siDocker,
  vite: siVite,
  vercel: siVercel,
};
