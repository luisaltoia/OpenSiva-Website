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

const ParallaxPixels = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Generate random pixels scattered across the transition zone
  const pixels = useMemo<Pixel[]>(() => {
    const arr: Pixel[] = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 4,
        speed: 0.3 + Math.random() * 1.4, // different parallax rates
        opacity: 0.15 + Math.random() * 0.85,
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
      {pixels.map((p) => (
        <PixelDot key={p.id} pixel={p} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
};

const PixelDot = ({
  pixel,
  scrollYProgress,
}: {
  pixel: Pixel;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -pixel.speed * 300]
  );

  return (
    <motion.div
      className="absolute rounded-[1px] bg-white"
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

export default ParallaxPixels;
