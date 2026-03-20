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

    // Use a seeded random for consistent scatter
    const seeded = (seed: number) => {
      const x = Math.sin(seed * 9301 + 49297) * 49297;
      return x - Math.floor(x);
    };

    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      // Base height: gentle wave so it's not flat but not mountains
      const wave = Math.sin(t * Math.PI * 4) * 1.5 + Math.sin(t * Math.PI * 9 + 1) * 0.8;
      const baseHeight = Math.round(4 + wave);

      // Dense bottom rows (always present) - these are the "solid" part
      for (let r = 0; r < baseHeight; r++) {
        const s = seeded(c * 100 + r);
        arr.push({
          col: c, row: r,
          blinkSeed: [0.3 + s * 0.7, 0.5 + seeded(c * 200 + r) * 0.5, 0.25 + seeded(c * 300 + r) * 0.5, 0.6 + seeded(c * 400 + r) * 0.4, 0.35 + s * 0.6],
          blinkDuration: 2 + s * 4,
          blinkDelay: seeded(c * 500 + r) * 5,
        });
      }

      // Scattered dissolve dots above the base — progressively sparser
      // This creates the "gradually appearing" / dissolving edge
      const maxScatter = 14;
      for (let r = baseHeight; r < baseHeight + maxScatter; r++) {
        const distFromBase = r - baseHeight;
        // Probability decreases with distance from base
        const prob = 1 - (distFromBase / maxScatter);
        // Apply a curve so it dissolves more naturally
        const threshold = prob * prob * prob; // cubic falloff
        const rnd = seeded(c * 1000 + r * 7 + 3);
        if (rnd < threshold) {
          const s = seeded(c * 100 + r);
          arr.push({
            col: c, row: r,
            blinkSeed: [0.2 + s * 0.5, 0.4 + seeded(c * 200 + r) * 0.4, 0.15 + seeded(c * 300 + r) * 0.4, 0.35 + seeded(c * 400 + r) * 0.35, 0.2 + s * 0.5],
            blinkDuration: 2 + s * 4,
            blinkDelay: seeded(c * 500 + r) * 5,
          });
        }
      }
    }
    return arr;
  }, []);

  return (
    <div
      className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5, transform: "translateY(-100%)" }}
    >
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
      animate={{ opacity: dot.blinkSeed }}
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
