import { motion, MotionValue, useTransform } from "framer-motion";
import { useMemo } from "react";

interface Dot {
  col: number;
  row: number;
  isScatter: boolean;
  blinkSeed?: number[];
  blinkDuration?: number;
  blinkDelay?: number;
}

const DOT_SIZE = 6;
const GAP = 2;
const STEP = DOT_SIZE + GAP;
const BASE_HEIGHT = 5;
const MAX_SCATTER = 16;
const TOTAL_HEIGHT = BASE_HEIGHT + MAX_SCATTER;

const seeded = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

interface Props {
  scrollProgress: MotionValue<number>;
}

const ParallaxPixels = ({ scrollProgress }: Props) => {
  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    const cols = Math.ceil(2000 / STEP);

    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      const wave = Math.sin(t * Math.PI * 4) * 1.5 + Math.sin(t * Math.PI * 9 + 1) * 0.8;
      const baseH = Math.round(BASE_HEIGHT + wave);

      for (let r = 0; r < baseH; r++) {
        arr.push({ col: c, row: r, isScatter: false });
      }

      for (let r = baseH; r < baseH + MAX_SCATTER; r++) {
        const distFromBase = r - baseH;
        const prob = 1 - distFromBase / MAX_SCATTER;
        const threshold = prob * prob * prob;
        if (seeded(c * 1000 + r * 7 + 3) < threshold) {
          const isSolid = seeded(c * 333 + r * 17) < 0.6;
          const shouldBlink = !isSolid && seeded(c * 777 + r * 13) < 0.5;
          const s = seeded(c * 100 + r);
          arr.push({
            col: c,
            row: r,
            isScatter: !isSolid,
            blinkSeed: shouldBlink
              ? [0.5 + s * 0.5, 0.8 + seeded(c * 200 + r) * 0.2, 0.4 + seeded(c * 300 + r) * 0.4, 0.9, 0.5 + s * 0.5]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 4 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 500 + r) * 5 : undefined,
          });
        }
      }
    }
    return arr;
  }, []);

  // As user scrolls, the pixel area grows taller (more pixels revealed below)
  const containerHeight = useTransform(scrollProgress, [0, 0.6], [TOTAL_HEIGHT * STEP, TOTAL_HEIGHT * STEP * 2.5]);

  return (
    <div
      className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5, transform: "translateY(-100%)" }}
    >
      <motion.div className="relative w-full" style={{ height: containerHeight }}>
        {dots.map((d, i) => (
          <PixelDot key={i} dot={d} scrollProgress={scrollProgress} />
        ))}
      </motion.div>
    </div>
  );
};

const PixelDot = ({
  dot,
  scrollProgress,
}: {
  dot: Dot;
  scrollProgress: MotionValue<number>;
}) => {
  const left = dot.col * STEP;
  const bottom = dot.row * STEP;

  const rowNorm = dot.isScatter ? dot.row / TOTAL_HEIGHT : 0;
  const scatterOpacity = useTransform(
    scrollProgress,
    [0.05, 0.2 + rowNorm * 0.3],
    [0, 1]
  );

  // Blinking dots: only use animate, no scroll-driven opacity conflict
  if (dot.blinkSeed) {
    return (
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          left,
          bottom,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: dot.blinkSeed }}
        transition={{
          duration: dot.blinkDuration,
          delay: dot.blinkDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        left,
        bottom,
        opacity: dot.isScatter ? scatterOpacity : 1,
      }}
    />
  );
};

export default ParallaxPixels;
