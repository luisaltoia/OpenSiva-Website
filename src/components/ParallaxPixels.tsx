import { motion, MotionValue, useTransform } from "framer-motion";
import { useMemo } from "react";

interface Dot {
  col: number;
  row: number;
  isScatter: boolean;
  isUpward?: boolean;
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
const MAX_UPWARD = 40; // how many rows can grow upward into hero

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

      // Base dots (bottom, always visible)
      for (let r = 0; r < baseH; r++) {
        const shouldBlink = seeded(c * 431 + r * 59) < 0.2;
        const s = seeded(c * 100 + r);
        arr.push({
          col: c,
          row: r,
          isScatter: false,
          blinkSeed: shouldBlink
            ? [1, 0.2 + seeded(c * 211 + r) * 0.4, 1, 0.4 + seeded(c * 311 + r) * 0.3, 1]
            : undefined,
          blinkDuration: shouldBlink ? 2 + s * 5 : undefined,
          blinkDelay: shouldBlink ? seeded(c * 611 + r) * 6 : undefined,
        });
      }

      // Scatter dots above base (existing upward scatter)
      for (let r = baseH; r < baseH + MAX_SCATTER; r++) {
        const distFromBase = r - baseH;
        const prob = 1 - distFromBase / MAX_SCATTER;
        const threshold = prob * prob * prob;
        if (seeded(c * 1000 + r * 7 + 3) < threshold) {
          const isSolid = seeded(c * 333 + r * 17) < 0.6;
          const shouldBlink = !isSolid && seeded(c * 777 + r * 13) < 0.6;
          const s = seeded(c * 100 + r);
          arr.push({
            col: c,
            row: r,
            isScatter: !isSolid,
            blinkSeed: shouldBlink
              ? [0.4 + s * 0.6, 1, 0.3 + seeded(c * 200 + r) * 0.3, 0.8, 0.5 + s * 0.5]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 7 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 500 + r) * 10 : undefined,
          });
        }
      }

      // Upward-growing dots: these appear progressively as we scroll
      // They extend above the existing scatter, consuming the hero
      const upwardBase = baseH + MAX_SCATTER;
      for (let r = 0; r < MAX_UPWARD; r++) {
        const row = upwardBase + r;
        // Denser at bottom, sparser at top (like the dissolve effect)
        const distNorm = r / MAX_UPWARD;
        const density = (1 - distNorm) * (1 - distNorm);
        if (seeded(c * 2000 + r * 13 + 7) < density) {
          const isSolid = seeded(c * 444 + r * 23) < (0.7 - distNorm * 0.4);
          const shouldBlink = !isSolid && seeded(c * 888 + r * 19) < 0.4;
          const s = seeded(c * 150 + r);
          arr.push({
            col: c,
            row: row,
            isScatter: !isSolid,
            isUpward: true,
            blinkSeed: shouldBlink
              ? [0.5 + s * 0.5, 1, 0.2 + seeded(c * 250 + r) * 0.4, 0.9, 0.4 + s * 0.6]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 6 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 550 + r) * 8 : undefined,
          });
        }
      }
    }
    return arr;
  }, []);

  const maxRow = TOTAL_HEIGHT + MAX_UPWARD;
  // Container grows taller as user scrolls, revealing upward dots
  const containerHeight = useTransform(
    scrollProgress,
    [0, 0.7],
    [TOTAL_HEIGHT * STEP, maxRow * STEP]
  );

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 30 }}
    >
      <motion.div className="relative w-full" style={{ height: containerHeight }}>
        {dots.map((d, i) => (
          <PixelDot key={i} dot={d} scrollProgress={scrollProgress} totalHeight={TOTAL_HEIGHT} maxUpward={MAX_UPWARD} />
        ))}
      </motion.div>
    </div>
  );
};

const PixelDot = ({
  dot,
  scrollProgress,
  totalHeight,
  maxUpward,
}: {
  dot: Dot;
  scrollProgress: MotionValue<number>;
  totalHeight: number;
  maxUpward: number;
}) => {
  const left = dot.col * STEP;
  const bottom = dot.row * STEP;

  // For upward dots: fade in based on scroll progress
  // Lower upward rows appear first, higher ones appear later
  const upwardNorm = dot.isUpward
    ? (dot.row - totalHeight) / maxUpward
    : 0;

  const upwardOpacity = useTransform(
    scrollProgress,
    [0.05 + upwardNorm * 0.5, 0.15 + upwardNorm * 0.5],
    [0, 1]
  );

  const rowNorm = dot.isScatter && !dot.isUpward ? dot.row / totalHeight : 0;
  const scatterOpacity = useTransform(
    scrollProgress,
    [0.05, 0.2 + rowNorm * 0.3],
    [0, 1]
  );

  // Determine opacity source
  const getOpacity = () => {
    if (dot.isUpward) return upwardOpacity;
    if (dot.isScatter) return scatterOpacity;
    return 1;
  };

  if (dot.blinkSeed) {
    // For upward blinking dots, they need scroll-gated visibility
    if (dot.isUpward) {
      return (
        <motion.div
          className="absolute rounded-full bg-white"
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            left,
            bottom,
            opacity: upwardOpacity,
          }}
        >
          <motion.div
            className="w-full h-full rounded-full bg-white"
            animate={{ opacity: dot.blinkSeed }}
            transition={{
              duration: dot.blinkDuration,
              delay: dot.blinkDelay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
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
        opacity: getOpacity(),
      }}
    />
  );
};

export default ParallaxPixels;
