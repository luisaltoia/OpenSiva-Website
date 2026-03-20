import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

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

const ParallaxPixels = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    const cols = Math.ceil(2000 / STEP);

    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      const wave = Math.sin(t * Math.PI * 4) * 1.5 + Math.sin(t * Math.PI * 9 + 1) * 0.8;
      const baseH = Math.round(BASE_HEIGHT + wave);

      // Solid base dots — pitch white, no blinking
      for (let r = 0; r < baseH; r++) {
        arr.push({ col: c, row: r, isScatter: false });
      }

      // Scatter dots above base — most are white, a few blink
      for (let r = baseH; r < baseH + MAX_SCATTER; r++) {
        const distFromBase = r - baseH;
        const prob = 1 - distFromBase / MAX_SCATTER;
        const threshold = prob * prob * prob;
        if (seeded(c * 1000 + r * 7 + 3) < threshold) {
          const shouldBlink = seeded(c * 777 + r * 13) < 0.25; // ~25% blink
          const s = seeded(c * 100 + r);
          arr.push({
            col: c,
            row: r,
            isScatter: true,
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

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5, transform: "translateY(-100%)" }}
    >
      <div className="relative w-full" style={{ height: TOTAL_HEIGHT * STEP }}>
        {dots.map((d, i) => (
          <PixelDot key={i} dot={d} scrollYProgress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
};

const PixelDot = ({
  dot,
  scrollYProgress,
}: {
  dot: Dot;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const left = dot.col * STEP;
  const bottom = dot.row * STEP;

  // Scatter dots grow upward as user scrolls — they start hidden and appear
  const rowNorm = dot.isScatter ? dot.row / TOTAL_HEIGHT : 0;
  const opacity = dot.isScatter
    ? useTransform(scrollYProgress, [0.1, 0.3 + rowNorm * 0.4], [0, 1])
    : undefined;

  if (dot.blinkSeed) {
    return (
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          left,
          bottom,
          opacity: opacity,
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
  }

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        left,
        bottom,
        opacity: dot.isScatter ? opacity : 1,
        willChange: dot.isScatter ? "opacity" : undefined,
      }}
    />
  );
};

export default ParallaxPixels;
