import {
  motion,
  MotionValue,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useMemo, useRef } from "react";

interface Dot {
  col: number;
  row: number;
  isScatter: boolean;
  layer: "static" | "growth";
  growthStart?: number;
  growthPhase?: number;
  growthTwinkleAmp?: number;
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
const GROWTH_ROWS = 12; // capped so it stays below CTA area
const CYCLE_DURATION = 6000;

const seeded = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

interface Props {
  scrollProgress: MotionValue<number>;
}

const ParallaxPixels = ({ scrollProgress }: Props) => {
  const cycle = useMotionValue(0);
  const startTime = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (startTime.current === null) startTime.current = time;
    const elapsed = (time - startTime.current) % CYCLE_DURATION;
    cycle.set(elapsed / CYCLE_DURATION);
  });

  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    const cols = Math.ceil(2000 / STEP);

    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      const wave =
        Math.sin(t * Math.PI * 4) * 1.5 + Math.sin(t * Math.PI * 9 + 1) * 0.8;
      const baseH = Math.round(BASE_HEIGHT + wave);

      // Static base dots
      for (let r = 0; r < baseH; r++) {
        const shouldBlink = seeded(c * 431 + r * 59) < 0.26;
        const s = seeded(c * 100 + r);
        arr.push({
          col: c,
          row: r,
          isScatter: false,
          layer: "static",
          blinkSeed: shouldBlink
            ? [1, 0.2 + seeded(c * 211 + r) * 0.4, 1, 0.4 + seeded(c * 311 + r) * 0.3, 1]
            : undefined,
          blinkDuration: shouldBlink ? 2 + s * 5 : undefined,
          blinkDelay: shouldBlink ? seeded(c * 611 + r) * 6 : undefined,
        });
      }

      // Static scatter dots
      for (let r = baseH; r < baseH + MAX_SCATTER; r++) {
        const distFromBase = r - baseH;
        const prob = 1 - distFromBase / MAX_SCATTER;
        const threshold = prob * prob * prob;

        if (seeded(c * 1000 + r * 7 + 3) < threshold) {
          const isSolid = seeded(c * 333 + r * 17) < 0.6;
          const shouldBlink = !isSolid && seeded(c * 777 + r * 13) < 0.78;
          const s = seeded(c * 100 + r);
          arr.push({
            col: c,
            row: r,
            isScatter: !isSolid,
            layer: "static",
            blinkSeed: shouldBlink
              ? [0.4 + s * 0.6, 1, 0.3 + seeded(c * 200 + r) * 0.3, 0.8, 0.5 + s * 0.5]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 7 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 500 + r) * 10 : undefined,
          });
        }
      }

      // Growth dots start from top edge of current silhouette (overlap 2 rows)
      const growthBase = baseH + MAX_SCATTER - 2;
      for (let r = 0; r < GROWTH_ROWS; r++) {
        const row = growthBase + r;
        const distNorm = r / Math.max(1, GROWTH_ROWS - 1);
        const density = 0.92 * Math.pow(1 - distNorm, 1.35);

        if (seeded(c * 2000 + r * 17 + 9) < density) {
          const startJitter = (seeded(c * 3100 + r * 23) - 0.5) * 0.28;
          const growthStart = clamp01(distNorm * 0.95 + startJitter);
          const shouldBlink = seeded(c * 890 + r * 29) < 0.39;
          const s = seeded(c * 150 + r);

          arr.push({
            col: c,
            row,
            isScatter: false,
            layer: "growth",
            growthStart,
            growthPhase: seeded(c * 4100 + r * 31) * Math.PI * 2,
            growthTwinkleAmp: 0.14 + seeded(c * 5100 + r * 37) * 0.16,
            blinkSeed: shouldBlink
              ? [0.5 + s * 0.5, 1, 0.25 + seeded(c * 250 + r) * 0.35, 0.9, 0.45 + s * 0.55]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 6 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 550 + r) * 8 : undefined,
          });
        }
      }
    }

    return arr;
  }, []);

  const maxRow = TOTAL_HEIGHT + GROWTH_ROWS;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 30, height: maxRow * STEP }}
    >
      <div className="relative w-full" style={{ height: maxRow * STEP }}>
        {dots.map((dot, i) => (
          <PixelDot key={i} dot={dot} scrollProgress={scrollProgress} cycle={cycle} />
        ))}
      </div>
    </div>
  );
};

const PixelDot = ({
  dot,
  scrollProgress,
  cycle,
}: {
  dot: Dot;
  scrollProgress: MotionValue<number>;
  cycle: MotionValue<number>;
}) => {
  const left = dot.col * STEP;
  const bottom = dot.row * STEP;

  // 0 → 1 → 0 growth each 6s
  const growthOpacity = useTransform(cycle, (t) => {
    if (dot.layer !== "growth") return 1;

    const triangle = t < 0.5 ? t * 2 : (1 - t) * 2;
    const eased = triangle * triangle * (3 - 2 * triangle);
    const revealStart = dot.growthStart ?? 0;
    const revealBand = 0.2;
    const reveal = clamp01((eased - revealStart) / revealBand);

    const phase = dot.growthPhase ?? 0;
    const amp = dot.growthTwinkleAmp ?? 0.2;
    const twinkle = 1 - amp * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 + phase));

    return reveal * twinkle;
  });

  const scatterRowNorm = dot.isScatter ? dot.row / TOTAL_HEIGHT : 0;
  const scatterOpacity = useTransform(
    scrollProgress,
    [0.05, 0.2 + scatterRowNorm * 0.3],
    [0, 1]
  );

  const layerOpacity = dot.layer === "growth" ? growthOpacity : dot.isScatter ? scatterOpacity : 1;

  if (dot.blinkSeed) {
    return (
      <motion.div
        className="absolute rounded-full bg-primary-foreground"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          left,
          bottom,
          opacity: layerOpacity,
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
        opacity: layerOpacity,
      }}
    />
  );
};

export default ParallaxPixels;
