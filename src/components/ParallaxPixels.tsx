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
  tier: "base" | "scatter";
  /** 0–1: when this dot starts appearing in the expansion wave */
  revealStart?: number;
  /** how wide the fade-in band is */
  revealBand?: number;
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

// Timing: grow 1s → hold 4s → shrink 1s → hold 4s = 10s
const CYCLE_DURATION = 10000;

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

      // Base dots — static, ~34% blink (increased)
      for (let r = 0; r < baseH; r++) {
        const shouldBlink = seeded(c * 431 + r * 59) < 0.34;
        const s = seeded(c * 100 + r);
        arr.push({
          col: c, row: r, tier: "base",
          blinkSeed: shouldBlink
            ? [1, 0.15 + seeded(c * 211 + r) * 0.35, 1, 0.3 + seeded(c * 311 + r) * 0.35, 1]
            : undefined,
          blinkDuration: shouldBlink ? 2 + s * 5 : undefined,
          blinkDelay: shouldBlink ? seeded(c * 611 + r) * 6 : undefined,
        });
      }

      // Scatter dots — animated growth with COLUMN-based jitter for "branches"
      for (let r = baseH; r < baseH + MAX_SCATTER; r++) {
        const distFromBase = r - baseH;
        const distNorm = distFromBase / MAX_SCATTER;
        const prob = 1 - distNorm;
        const threshold = prob * prob * prob;

        if (seeded(c * 1000 + r * 7 + 3) < threshold) {
          const shouldBlink = seeded(c * 777 + r * 13) < 0.34;
          const s = seeded(c * 100 + r);

          // Column-based delay creates "branches" — nearby columns grow at similar times
          // but distant columns grow at very different times
          const colGroup = Math.floor(c / 8); // groups of ~8 columns
          const groupDelay = seeded(colGroup * 7919) * 0.55; // 0–0.55 delay per group
          const individualJitter = (seeded(c * 909 + r * 41) - 0.5) * 0.12;
          
          const revealStart = clamp01(distNorm * 0.4 + groupDelay + individualJitter);

          arr.push({
            col: c, row: r, tier: "scatter",
            revealStart,
            revealBand: 0.08 + seeded(c * 1409 + r * 19) * 0.06,
            blinkSeed: shouldBlink
              ? [0.4 + s * 0.6, 1, 0.25 + seeded(c * 200 + r) * 0.3, 0.85, 0.5 + s * 0.5]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 7 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 500 + r) * 10 : undefined,
          });
        }
      }
    }

    return arr;
  }, []);

  const containerHeight = TOTAL_HEIGHT * STEP;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 30, height: containerHeight }}
    >
      <div className="relative w-full" style={{ height: containerHeight }}>
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

  // Cycle shape: grow(0–0.1) → hold(0.1–0.5) → shrink(0.5–0.6) → hold(0.6–1.0)
  // Returns 0→1 during grow, 1 during top hold, 1→0 during shrink, 0 during bottom hold
  const expansion = useTransform(cycle, (t) => {
    if (t < 0.1) return t / 0.1; // grow
    if (t < 0.5) return 1;       // hold at top
    if (t < 0.6) return 1 - (t - 0.5) / 0.1; // shrink
    return 0;                     // hold at bottom
  });

  const scatterOpacity = useTransform(expansion, (v) => {
    if (dot.tier !== "scatter") return 1;
    const start = dot.revealStart ?? 0;
    const band = dot.revealBand ?? 0.1;
    return clamp01((v - start) / band);
  });

  const layerOpacity = dot.tier === "scatter" ? scatterOpacity : 1;

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
