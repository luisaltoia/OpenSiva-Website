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

  // Generate pixels clustered toward the bottom, creating a "rising edge"
  // that looks like the white section dissolving upward into the black hero
  const pixels = useMemo<Pixel[]>(() => {
    const arr: Pixel[] = [];
    for (let i = 0; i < 200; i++) {
      // Bias y heavily toward the bottom (100% = bottom edge / white section boundary)
      // Using pow to cluster: most pixels near bottom, fewer scattered high
      const rawY = Math.random();
      const biasedY = 1 - Math.pow(rawY, 0.4); // clusters near y=1 (bottom)

      // Size: larger near bottom (part of the "solid" edge), tiny as they scatter up
      const distFromBottom = 1 - biasedY;
      const size = distFromBottom < 0.15
        ? 3 + Math.random() * 5  // big chunky pixels at the very bottom edge
        : distFromBottom < 0.4
          ? 2 + Math.random() * 3
          : 1 + Math.random() * 2; // small scattered pixels higher up

      // Opacity: fully opaque near bottom, fading as they go up
      const opacity = distFromBottom < 0.2
        ? 0.8 + Math.random() * 0.2
        : distFromBottom < 0.5
          ? 0.4 + Math.random() * 0.4
          : 0.1 + Math.random() * 0.3;

      arr.push({
        id: i,
        x: Math.random() * 100,
        y: biasedY * 100,
        size,
        speed: 0.2 + Math.random() * 1.2,
        opacity,
      });
    }
    return arr;
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 15, height: "60%" }}
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
    [0, -pixel.speed * 250]
  );

  return (
    <motion.div
      className="absolute bg-white"
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
