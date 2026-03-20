import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
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

const Hero = () => {
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
      {/* Floating particles */}
      {particles.map((p) => (
        <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} size={p.size} />
      ))}

      {/* Subtle moving line accents */}
      <div className="absolute right-[20%] top-[15%] w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-drift-slow" />
      <div className="absolute right-[35%] bottom-[20%] w-px h-16 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent animate-drift-slow-reverse" />
      <div className="absolute right-[60%] top-[60%] w-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-drift-horizontal" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Neon logo as centered headline */}
          <div className="flex justify-center mb-10 reveal">
            <img
              src={neonLogo}
              alt="OpenSiva"
              className="h-16 md:h-24 lg:h-28 neon-glow"
            />
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white text-architectural mb-6 reveal">
            We turn what you know into a system that serves thousands.
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-light tracking-wide mb-10 reveal-delayed max-w-2xl mx-auto">
            Your playbooks. Your frameworks. Your decision logic. Delivered to thousands of people at once without adding a single person to payroll or a single call to your calendar.
          </p>
          <div className="reveal-delayed">
            <Button asChild size="lg" className="bg-white text-black border-white hover:bg-black hover:text-white hover:border-white/20 transition-colors duration-300 mb-6">
              <Link to="/contact">Talk to Us</Link>
            </Button>
            <p className="text-xs text-white/30 tracking-wide">
              AI infrastructure by SevenTrain Ventures
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
