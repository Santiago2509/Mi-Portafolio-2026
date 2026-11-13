"use client";
import { useCallback, useState } from "react";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import Loader from "./Loader";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Journey from "./Journey";
import Projects from "./Projects";
import Skills from "./Skills";
import Contact from "./Contact";
import Network from "./Network";

export default function Experience() {
  const [revealed, setRevealed] = useState(false); // loader started opening → hero animates in
  const [loaderGone, setLoaderGone] = useState(false);
  const reveal = useCallback(() => setRevealed(true), []);
  const done = useCallback(() => setLoaderGone(true), []);

  return (
    <div className="grain">
      <SmoothScroll locked={!loaderGone} />
      <Cursor />
      <Network />
      {!loaderGone && <Loader onReveal={reveal} onDone={done} />}
      <Navbar />
      <main>
        <Hero ready={revealed} />
        <About />
        <Journey />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}
