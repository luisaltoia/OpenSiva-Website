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
  tier: "base" | "sparkle";
  blinkSeed?: number[];
  blinkDuration?: number;
  blinkDelay?: number;
  // sparkle-specific: each has its own random on/off cycle
  sparkleSpeed?: number;
  sparkleOffset?: number;
}

const DOT_SIZE = 6;
const GAP = 2;
const STEP = DOT_SIZE + GAP;
const BASE_HEIGHT = 5;
const SPARKLE_ZONE = 14; // rows above base where sparkles randomly appear/disappear
const TOTAL_HEIGHT = BASE_HEIGHT + SPARKLE_ZONE;

const seeded = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

interface Props {
  scrollProgress: MotionValue<number>;
}

const ParallaxPixels = ({ scrollProgress }: Props) => {
  const time = useMotionValue(0);
  const startTime = useRef<number | null>(null);

  useAnimationFrame((t) => {
    if (startTime.current === null) startTime.current = t;
    time.set((t - startTime.current) / 1000); // seconds
  });

  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    const cols = Math.ceil(2000 / STEP);

    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      // Multi-frequency jagged edge — creates irregular "branches" of varying height
      const wave =
        Math.sin(t * Math.PI * 4) * 1.5 +
        Math.sin(t * Math.PI * 9 + 1) * 0.8 +
        Math.sin(t * Math.PI * 23 + 3.7) * 1.2 + // high-freq jaggedness
        (seeded(c * 7 + 13) - 0.5) * 3.5; // per-column random spikes
      const baseH = Math.max(3, Math.round(BASE_HEIGHT + wave));

      // Scattered outlier dots above the base edge (dissolving border like the reference)
      const hasOutlier1 = seeded(c * 3001 + 7) < 0.3;
      const hasOutlier2 = seeded(c * 4001 + 11) < 0.15;
      const outlierMax = baseH + (hasOutlier1 ? Math.round(1 + seeded(c * 5001) * 3) : 0);
      const outlierMax2 = hasOutlier2 ? outlierMax + Math.round(1 + seeded(c * 6001) * 2) : outlierMax;
      const effectiveH = Math.min(outlierMax2, TOTAL_HEIGHT - 2); // cap below CTA

      // Base dots — static silhouette with dissolving edge
      for (let r = 0; r < effectiveH; r++) {
        // Above baseH, dots become probabilistic (dissolving edge)
        if (r >= baseH) {
          const edgeDist = (r - baseH) / (effectiveH - baseH + 1);
          const keepChance = (1 - edgeDist) * (1 - edgeDist);
          if (seeded(c * 811 + r * 67) > keepChance) continue;
        }

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

      // Sparkle zone — dots that randomly pop on/off independently
      for (let r = baseH; r < baseH + SPARKLE_ZONE; r++) {
        const distFromBase = r - baseH;
        const distNorm = distFromBase / SPARKLE_ZONE;
        // Sparser the higher up: cubic falloff
        const prob = (1 - distNorm);
        const chance = prob * prob * prob * 0.45;

        if (seeded(c * 1000 + r * 7 + 3) < chance) {
          const shouldBlink = seeded(c * 8888 + r * 31) < 0.34;
          const s = seeded(c * 100 + r);
          arr.push({
            col: c, row: r, tier: "sparkle",
            sparkleSpeed: 2 + seeded(c * 1337 + r * 47) * 6,
            sparkleOffset: seeded(c * 2221 + r * 89) * Math.PI * 2,
            blinkSeed: shouldBlink
              ? [1, 0.2 + seeded(c * 260 + r) * 0.3, 1, 0.4 + seeded(c * 360 + r) * 0.3, 1]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 5 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 660 + r) * 7 : undefined,
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
          <PixelDot key={i} dot={dot} time={time} />
        ))}
      </div>
    </div>
  );
};

const PixelDot = ({
  dot,
  time,
}: {
  dot: Dot;
  time: MotionValue<number>;
}) => {
  const left = dot.col * STEP;
  const bottom = dot.row * STEP;

  // Sparkle dots: smooth fade in/out using sin wave (no sharp cut)
  const sparkleOpacity = useTransform(time, (t) => {
    if (dot.tier !== "sparkle") return 1;
    const speed = dot.sparkleSpeed ?? 4;
    const offset = dot.sparkleOffset ?? 0;
    const wave = Math.sin((t / speed) * Math.PI * 2 + offset);
    // Smooth: map sin(-1..1) to opacity(0..1)
    return Math.max(0, wave * 0.5 + 0.5);
  });

  const layerOpacity = dot.tier === "sparkle" ? sparkleOpacity : 1;

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
