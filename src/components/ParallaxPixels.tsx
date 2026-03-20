import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo } from "react";

interface Pixel {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface FloatingPixel {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

const ParallaxPixels = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Wave-shaped cluster of circles at the transition boundary
  const wavePixels = useMemo<Pixel[]>(() => {
    const arr: Pixel[] = [];
    const count = 500;
    for (let i = 0; i < count; i++) {
      const x = (i / count) * 100;
      // Multi-wave baseline using sine waves
      const wave1 = Math.sin((x / 100) * Math.PI * 3) * 12;
      const wave2 = Math.sin((x / 100) * Math.PI * 5 + 1) * 6;
      const wave3 = Math.sin((x / 100) * Math.PI * 8 + 2) * 3;
      const waveY = 50 + wave1 + wave2 + wave3;

      // Scatter circles around the wave line with more density near center
      const scatter = (Math.random() - 0.5) * 35;
      const distFromWave = Math.abs(scatter);
      const y = waveY + scatter;

      // Circles closer to wave center are bigger and more opaque
      const size = distFromWave < 5
        ? 3 + Math.random() * 4
        : distFromWave < 12
          ? 2 + Math.random() * 3
          : 1 + Math.random() * 2;

      const opacity = distFromWave < 5
        ? 0.7 + Math.random() * 0.3
        : distFromWave < 12
          ? 0.4 + Math.random() * 0.4
          : 0.15 + Math.random() * 0.3;

      arr.push({
        id: i,
        x: x + (Math.random() - 0.5) * 2,
        y,
        size,
        speed: 0.3 + Math.random() * 1.0 + (distFromWave < 8 ? 0.3 : 0),
        opacity,
      });
    }
    return arr;
  }, []);

  // Ambient floating pixels that drift around the hero area
  const floaters = useMemo<FloatingPixel[]>(() => {
    const arr: FloatingPixel[] = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        duration: 4 + Math.random() * 8,
        delay: Math.random() * 5,
        driftX: (Math.random() - 0.5) * 60,
        driftY: (Math.random() - 0.5) * 40,
      });
    }
    return arr;
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 15 }}
    >
      {/* Wave cluster circles */}
      {wavePixels.map((p) => (
        <WaveDot key={p.id} pixel={p} scrollYProgress={scrollYProgress} />
      ))}
      {/* Ambient floating glowing pixels */}
      {floaters.map((f) => (
        <FloatingDot key={`f-${f.id}`} pixel={f} />
      ))}
    </div>
  );
};

const WaveDot = ({
  pixel,
  scrollYProgress,
}: {
  pixel: Pixel;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const y = useTransform(scrollYProgress, [0, 1], [0, -pixel.speed * 280]);

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: pixel.size,
        height: pixel.size,
        left: `${pixel.x}%`,
        top: `${pixel.y}%`,
        opacity: pixel.opacity,
        y,
        willChange: "transform",
      }}
    />
  );
};

const FloatingDot = ({ pixel }: { pixel: FloatingPixel }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    style={{
      width: pixel.size,
      height: pixel.size,
      left: `${pixel.x}%`,
      top: `${pixel.y}%`,
    }}
    animate={{
      x: [0, pixel.driftX, -pixel.driftX * 0.5, 0],
      y: [0, pixel.driftY, -pixel.driftY * 0.6, 0],
      opacity: [0.05, 0.5, 0.15, 0.4, 0.05],
      scale: [1, 1.4, 0.8, 1],
    }}
    transition={{
      duration: pixel.duration,
      delay: pixel.delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default ParallaxPixels;
