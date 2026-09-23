import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import CustomCursor from "./components/layout/CustomCursor";
import CommandPalette from "./components/layout/CommandPalette";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Experience from "./components/sections/Experience";
import Skills from "./components/sections/Skills";
import Projects from "./components/sections/Projects";
import Achievements from "./components/sections/Achievements";
import Contact from "./components/sections/Contact";

export default function App() {
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-[--void] text-[--text-hi] overflow-x-hidden">
      <CustomCursor />
      <CommandPalette />

      <div
        className="fixed top-0 left-0 h-[2px] bg-[--brass] z-[99999] transition-all duration-100"
        ref={progressRef}
        style={{ width: "0%" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Navbar />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </div>
  );
}