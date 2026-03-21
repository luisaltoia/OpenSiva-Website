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
    }

    return arr;
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 30, height: TOTAL_HEIGHT * STEP }}
    >
      <div className="relative w-full" style={{ height: TOTAL_HEIGHT * STEP }}>
        {dots.map((dot, i) => (
          <PixelDot key={i} dot={dot} scrollProgress={scrollProgress} />
        ))}
      </div>
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
  const scatterOpacity = useTransform(scrollProgress, [0.05, 0.2 + rowNorm * 0.3], [0, 1]);
  const baseOpacity = dot.isScatter ? scatterOpacity : 1;

  if (dot.blinkSeed) {
    return (
      <motion.div
        className="absolute rounded-full bg-primary-foreground"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          left,
          bottom,
          opacity: baseOpacity,
        }}
      >
        <motion.div
          className="h-full w-full rounded-full bg-primary-foreground"
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
      className="absolute rounded-full bg-primary-foreground"
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        left,
        bottom,
        opacity: baseOpacity,
      }}
    />
  );
};

export default ParallaxPixels;
