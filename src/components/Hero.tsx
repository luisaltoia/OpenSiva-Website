import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";
import neonLogo from "@/assets/opensiva-neon-logo.png";

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

interface HeroProps {
  scrollProgress?: MotionValue<number>;
}

const Hero = ({ scrollProgress }: HeroProps) => {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 50 + Math.random() * 48,
      y: 10 + Math.random() * 80,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 5,
    }))
  ).current;

  // Phase 1 (0→0.35): logo fades out
  const logoOpacity = useTransform(scrollProgress ?? new MotionValue(), [0, 0.35], [1, 0]);
  const logoScale = useTransform(scrollProgress ?? new MotionValue(), [0, 0.35], [1, 0.85]);

  // Phase 2 (0.25→0.55): text fades in
  const textOpacity = useTransform(scrollProgress ?? new MotionValue(), [0.25, 0.55], [0, 1]);
  const textY = useTransform(scrollProgress ?? new MotionValue(), [0.25, 0.55], [30, 0]);

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
          {/* Logo — visible initially, fades out on first scroll phase */}
          <motion.div
            className="flex justify-center absolute inset-0 items-center"
            style={{
              opacity: logoOpacity,
              scale: logoScale,
            }}
          >
            <img
              src={neonLogo}
              alt="OpenSiva"
              className="h-44 md:h-64 lg:h-72 neon-glow"
            />
          </motion.div>

          {/* Text — fades in during second scroll phase */}
          <motion.div
            style={{
              opacity: textOpacity,
              y: textY,
            }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white text-architectural mb-6">
              We turn what you know into a system that serves thousands.
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-light tracking-wide mb-10 max-w-2xl mx-auto">
              Your playbooks. Your frameworks. Your decision logic. Delivered to thousands of people at once without adding a single person to payroll or a single call to your calendar.
            </p>
            <div>
              <Button asChild size="lg" className="bg-white text-black border-white hover:bg-black hover:text-white hover:border-white/20 transition-colors duration-300 mb-6">
                <Link to="/contact">Talk to Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
