import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const rotatingWords = ["AI Products", "AI Agents", "Automations"];

const Particle = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <div
    className="absolute rounded-full bg-white/20"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      animation: `float ${8 + delay * 2}s ease-in-out ${delay}s infinite alternate`,
    }}
  />
);

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 50 + Math.random() * 48,
      y: 10 + Math.random() * 80,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 5,
    }))
  ).current;

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-black">
      {particles.map((p) => (
        <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
      ))}

      <div className="absolute right-[20%] top-[15%] w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-drift-slow" />
      <div className="absolute right-[35%] bottom-[20%] w-px h-16 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent animate-drift-slow-reverse" />
      <div className="absolute right-[60%] top-[60%] w-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-drift-horizontal" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white text-architectural mb-6">
            We build{" "}
            <span className="inline-block relative align-bottom overflow-hidden" style={{ width: "max-content", maxWidth: "100%" }}>
              <span className="invisible">{rotatingWords.reduce((a, b) => a.length > b.length ? a : b)}</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="absolute inset-0 text-white"
                  initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            for businesses ready to scale without the overhead.
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-light tracking-wide mb-10 max-w-2xl mx-auto">
            We take the knowledge, decisions, and processes your business depends on and turn them into AI systems that operate without adding headcount. Designed, built, and operated.
          </p>
          <div>
            <Button asChild size="lg" className="bg-white text-black border-white hover:bg-black hover:text-white hover:border-white/20 transition-colors duration-300 mb-6">
              <Link to="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
