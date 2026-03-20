import { motion } from "framer-motion";
import { useMemo } from "react";

interface Dot {
  col: number;
  row: number;
  delay: number;
}

const DOT_SIZE = 6;
const GAP = 2;
const STEP = DOT_SIZE + GAP;

const ParallaxPixels = () => {
  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    // Calculate columns to fill viewport width
    const cols = Math.ceil(1920 / STEP) + 2;

    // Generate a jagged top edge using layered sine waves
    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      // Multi-frequency wave for organic jagged edge
      const h1 = Math.sin(t * Math.PI * 6) * 4;
      const h2 = Math.sin(t * Math.PI * 14 + 1.3) * 2;
      const h3 = Math.sin(t * Math.PI * 22 + 0.7) * 1.5;
      const h4 = Math.cos(t * Math.PI * 10 + 2.1) * 3;
      // Base height + wave variations (rows of dots in this column)
      const height = Math.max(2, Math.round(8 + h1 + h2 + h3 + h4));

      for (let r = 0; r < height; r++) {
        arr.push({
          col: c,
          row: r,
          delay: Math.random() * 4,
        });
      }
    }
    return arr;
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 15 }}
    >
      {/* The dot grid sits at the very bottom, acting as the top edge of the white section */}
      <div className="relative w-full" style={{ height: 20 * STEP }}>
        {dots.map((d, i) => (
          <BlinkDot key={i} dot={d} />
        ))}
      </div>
    </div>
  );
};

const BlinkDot = ({ dot }: { dot: Dot }) => {
  // Position from bottom up: row 0 is the bottommost
  const left = dot.col * STEP;
  const bottom = dot.row * STEP;

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        left,
        bottom,
        willChange: "opacity",
      }}
      animate={{
        opacity: [
          0.4 + Math.random() * 0.5,
          0.7 + Math.random() * 0.3,
          0.3 + Math.random() * 0.4,
          0.6 + Math.random() * 0.4,
          0.4 + Math.random() * 0.5,
        ],
      }}
      transition={{
        duration: 2 + Math.random() * 3,
        delay: dot.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default ParallaxPixels;
