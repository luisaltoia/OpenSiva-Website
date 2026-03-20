import { motion } from "framer-motion";
import { useMemo } from "react";

interface Dot {
  col: number;
  row: number;
  blinkSeed: number[];
  blinkDuration: number;
  blinkDelay: number;
}

const DOT_SIZE = 6;
const GAP = 2;
const STEP = DOT_SIZE + GAP;

const ParallaxPixels = () => {
  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    const cols = Math.ceil(2000 / STEP);

    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      // Multi-frequency wave for organic jagged top edge
      const h1 = Math.sin(t * Math.PI * 6) * 5;
      const h2 = Math.sin(t * Math.PI * 14 + 1.3) * 2.5;
      const h3 = Math.sin(t * Math.PI * 22 + 0.7) * 1.5;
      const h4 = Math.cos(t * Math.PI * 10 + 2.1) * 3;
      const h5 = Math.sin(t * Math.PI * 30 + 3.0) * 1;
      const height = Math.max(2, Math.round(10 + h1 + h2 + h3 + h4 + h5));

      for (let r = 0; r < height; r++) {
        // Pre-generate random blink keyframes (never go below 0.25)
        const s1 = 0.3 + Math.random() * 0.7;
        const s2 = 0.5 + Math.random() * 0.5;
        const s3 = 0.25 + Math.random() * 0.5;
        const s4 = 0.6 + Math.random() * 0.4;
        const s5 = 0.35 + Math.random() * 0.6;
        arr.push({
          col: c,
          row: r,
          blinkSeed: [s1, s2, s3, s4, s5],
          blinkDuration: 2 + Math.random() * 4,
          blinkDelay: Math.random() * 5,
        });
      }
    }
    return arr;
  }, []);

  return (
    <div
      className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5, transform: "translateY(-100%)" }}
    >
      {/* Grid grows upward from the section boundary */}
      <div className="relative w-full" style={{ height: 22 * STEP }}>
        {dots.map((d, i) => (
          <BlinkDot key={i} dot={d} />
        ))}
      </div>
    </div>
  );
};

const BlinkDot = ({ dot }: { dot: Dot }) => {
  const left = dot.col * STEP;
  // row 0 = closest to the white section (bottom), higher rows go up into the black
  const bottom = dot.row * STEP;

  return (
    <motion.div
      className="absolute rounded-full bg-background"
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        left,
        bottom,
        willChange: "opacity",
      }}
      animate={{
        opacity: dot.blinkSeed,
      }}
      transition={{
        duration: dot.blinkDuration,
        delay: dot.blinkDelay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default ParallaxPixels;
