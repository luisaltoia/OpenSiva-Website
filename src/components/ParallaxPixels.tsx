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
  tier: "base" | "scatter" | "residue";
  revealStart?: number;
  revealBand?: number;
  revealShift?: number;
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

      // Base dots — static, ~26% blink
      for (let r = 0; r < baseH; r++) {
        const shouldBlink = seeded(c * 431 + r * 59) < 0.26;
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

      // Scatter dots — animated wave growth
      for (let r = baseH; r < baseH + MAX_SCATTER; r++) {
        const distFromBase = r - baseH;
        const distNorm = distFromBase / MAX_SCATTER;
        const prob = 1 - distNorm;
        const threshold = prob * prob * prob;

        if (seeded(c * 1000 + r * 7 + 3) < threshold) {
          const isSolid = seeded(c * 333 + r * 17) < 0.6;
          const shouldBlink = !isSolid && seeded(c * 777 + r * 13) < 0.78;
          const s = seeded(c * 100 + r);
          const jitter = (seeded(c * 909 + r * 41) - 0.5) * 0.22;

          arr.push({
            col: c, row: r, tier: "scatter",
            revealStart: clamp01(distNorm * 0.88 + jitter),
            revealBand: 0.12 + seeded(c * 1409 + r * 19) * 0.1,
            revealShift: (seeded(c * 1709 + r * 43) - 0.5) * 0.24,
            blinkSeed: shouldBlink
              ? [0.4 + s * 0.6, 1, 0.25 + seeded(c * 200 + r) * 0.3, 0.85, 0.5 + s * 0.5]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 7 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 500 + r) * 10 : undefined,
          });
        }
      }

      // Residue dots — always-on sparse dots scattered through the scatter zone
      // so even when the wave retreats, it doesn't look like a clean line
      for (let r = baseH; r < baseH + MAX_SCATTER; r++) {
        const distFromBase = r - baseH;
        const distNorm = distFromBase / MAX_SCATTER;
        // Sparse: ~12% chance, sparser higher up
        const residueChance = 0.12 * (1 - distNorm * 0.7);
        const seed2 = seeded(c * 5555 + r * 71);
        if (seed2 < residueChance) {
          // Make sure we don't overlap with an existing scatter dot at same position
          const overlapSeed = seeded(c * 1000 + r * 7 + 3);
          const prob = 1 - distNorm;
          const threshold = prob * prob * prob;
          if (overlapSeed >= threshold) {
            // No scatter dot here, so place a residue
            const shouldBlink = seeded(c * 6666 + r * 83) < 0.35;
            const s = seeded(c * 150 + r);
            arr.push({
              col: c, row: r, tier: "residue",
              blinkSeed: shouldBlink
                ? [1, 0.3 + seeded(c * 260 + r) * 0.3, 1, 0.5 + seeded(c * 360 + r) * 0.3, 1]
                : undefined,
              blinkDuration: shouldBlink ? 2.5 + s * 5 : undefined,
              blinkDelay: shouldBlink ? seeded(c * 660 + r) * 7 : undefined,
            });
          }
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

  // Smooth triangle wave 0→1→0
  const expansion = useTransform(cycle, (t) => {
    const triangle = t < 0.5 ? t * 2 : (1 - t) * 2;
    return triangle * triangle * (3 - 2 * triangle);
  });

  // Scatter dots: full 100% opacity when revealed
  const scatterOpacity = useTransform(expansion, (v) => {
    if (dot.tier !== "scatter") return 1;
    const shifted = clamp01(v + (dot.revealShift ?? 0));
    const start = dot.revealStart ?? 0;
    const band = dot.revealBand ?? 0.15;
    return clamp01((shifted - start) / band);
  });

  // Residue and base are always fully opaque (opacity 1)
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
