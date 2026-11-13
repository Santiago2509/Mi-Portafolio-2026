# Portafolio 2026 · Santiago

Portafolio personal inmersivo en rojo y negro.

## Stack
- **Next.js 15 + React 19 + TypeScript**
- **Tailwind CSS 4**
- **GSAP + ScrollTrigger**: intro, revelados y scroll horizontal de proyectos
- **Lenis**: scroll suave
- **Three.js / React Three Fiber**: teclado 3D de skills
- **Matter.js**: píldoras con física

## Desarrollo
```bash
npm install
npm run dev
```
Abre http://localhost:3000

## Editar contenido
Todos los textos, proyectos, skills y datos de contacto están en `src/data/content.ts`
(los valores con `TODO` son provisionales).

Fotos editadas en `public/images/`. Para usar capturas reales de proyectos, colócalas en
`public/images/projects/` y añade `image: "/images/projects/archivo.webp"` al proyecto.

## Publicar
Conecta el repo en [Vercel](https://vercel.com) y se despliega automáticamente.
