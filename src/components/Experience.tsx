"use client";
import { useCallback, useState } from "react";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import Loader from "./Loader";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Marquee from "./Marquee";
import About from "./About";
import Projects from "./Projects";
import Skills from "./Skills";
import Journey from "./Journey";
import Contact from "./Contact";

export default function Experience() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);

  return (
    <div className="grain">
      <SmoothScroll locked={!ready} />
      <Cursor />
      {!ready && <Loader onDone={done} />}
      <Navbar />
      <main>
        <Hero ready={ready} />
        <Marquee items={["Desarrollo web", "Diseño UI", "Motion", "Experiencias 3D", "Creatividad"]} />
        <About />
        <Projects />
        <Marquee items={["Disponible para proyectos", "Hablemos", "Freelance", "2026"]} tilt={2} />
        <Skills />
        <Journey />
        <Contact />
      </main>
    </div>
  );
}
