import { motion, MotionValue, useTransform, useMotionValue, useAnimationFrame } from "framer-motion";
import { useMemo, useRef } from "react";

interface Dot {
  col: number;
  row: number;
  isScatter: boolean;
  isWave?: boolean;
  waveRow?: number; // normalized 0-1, how high in the wave zone
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
const WAVE_ROWS = 35; // extra rows for the wave animation
const CYCLE_DURATION = 6000; // 6 seconds full cycle

const seeded = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

interface Props {
  scrollProgress: MotionValue<number>;
}

const ParallaxPixels = ({ scrollProgress }: Props) => {
  // Looping wave progress: 0→1→0 over CYCLE_DURATION
  const waveProgress = useMotionValue(0);
  const startTime = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (startTime.current === null) startTime.current = time;
    const elapsed = (time - startTime.current) % CYCLE_DURATION;
    const t = elapsed / CYCLE_DURATION;
    // Triangle wave: 0→1 in first half, 1→0 in second half
    const wave = t < 0.5 ? t * 2 : 2 - t * 2;
    // Ease it for smoother feel
    const eased = wave * wave * (3 - 2 * wave); // smoothstep
    waveProgress.set(eased);
  });

  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    const cols = Math.ceil(2000 / STEP);

    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      const wave = Math.sin(t * Math.PI * 4) * 1.5 + Math.sin(t * Math.PI * 9 + 1) * 0.8;
      const baseH = Math.round(BASE_HEIGHT + wave);

      // Base dots
      for (let r = 0; r < baseH; r++) {
        const shouldBlink = seeded(c * 431 + r * 59) < 0.2;
        const s = seeded(c * 100 + r);
        arr.push({
          col: c, row: r, isScatter: false,
          blinkSeed: shouldBlink
            ? [1, 0.2 + seeded(c * 211 + r) * 0.4, 1, 0.4 + seeded(c * 311 + r) * 0.3, 1]
            : undefined,
          blinkDuration: shouldBlink ? 2 + s * 5 : undefined,
          blinkDelay: shouldBlink ? seeded(c * 611 + r) * 6 : undefined,
        });
      }

      // Scatter dots above base
      for (let r = baseH; r < baseH + MAX_SCATTER; r++) {
        const distFromBase = r - baseH;
        const prob = 1 - distFromBase / MAX_SCATTER;
        const threshold = prob * prob * prob;
        if (seeded(c * 1000 + r * 7 + 3) < threshold) {
          const isSolid = seeded(c * 333 + r * 17) < 0.6;
          const shouldBlink = !isSolid && seeded(c * 777 + r * 13) < 0.6;
          const s = seeded(c * 100 + r);
          arr.push({
            col: c, row: r, isScatter: !isSolid,
            blinkSeed: shouldBlink
              ? [0.4 + s * 0.6, 1, 0.3 + seeded(c * 200 + r) * 0.3, 0.8, 0.5 + s * 0.5]
              : undefined,
            blinkDuration: shouldBlink ? 2 + s * 7 : undefined,
            blinkDelay: shouldBlink ? seeded(c * 500 + r) * 10 : undefined,
          });
        }
      }

      // Wave dots — these animate up and down
      const waveBase = baseH + MAX_SCATTER;
      for (let r = 0; r < WAVE_ROWS; r++) {
        const row = waveBase + r;
        const distNorm = r / WAVE_ROWS;
        const density = (1 - distNorm) * (1 - distNorm);
        if (seeded(c * 2000 + r * 13 + 7) < density) {
          const isSolid = seeded(c * 444 + r * 23) < (0.7 - distNorm * 0.4);
          const shouldBlink = !isSolid && seeded(c * 888 + r * 19) < 0.4;
          const s = seeded(c * 150 + r);
          arr.push({
            col: c, row: row, isScatter: !isSolid, isWave: true,
            waveRow: distNorm,
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

  const maxRow = TOTAL_HEIGHT + WAVE_ROWS;
  const containerHeight = useTransform(
    scrollProgress,
    [0, 0.6],
    [maxRow * STEP, maxRow * STEP]
  );

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 30 }}
    >
      <motion.div className="relative w-full" style={{ height: containerHeight }}>
        {dots.map((d, i) => (
          <PixelDot key={i} dot={d} scrollProgress={scrollProgress} waveProgress={waveProgress} />
        ))}
      </motion.div>
    </div>
  );
};

const PixelDot = ({
  dot,
  scrollProgress,
  waveProgress,
}: {
  dot: Dot;
  scrollProgress: MotionValue<number>;
  waveProgress: MotionValue<number>;
}) => {
  const left = dot.col * STEP;
  const bottom = dot.row * STEP;

  // Wave dots: visible only when waveProgress is high enough to reveal their row
  // Lower wave rows appear first, higher ones need more progress
  const waveOpacity = useTransform(
    waveProgress,
    [Math.max(0, (dot.waveRow ?? 0) - 0.15), dot.waveRow ?? 0],
    [0, 1]
  );

  const rowNorm = dot.isScatter && !dot.isWave ? dot.row / TOTAL_HEIGHT : 0;
  const scatterOpacity = useTransform(
    scrollProgress,
    [0.05, 0.2 + rowNorm * 0.3],
    [0, 1]
  );

  const getOpacity = () => {
    if (dot.isWave) return waveOpacity;
    if (dot.isScatter) return scatterOpacity;
    return 1;
  };

  if (dot.blinkSeed) {
    if (dot.isWave) {
      return (
        <motion.div
          className="absolute rounded-full bg-white"
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            left,
            bottom,
            opacity: waveOpacity,
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
        style={{ width: DOT_SIZE, height: DOT_SIZE, left, bottom }}
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
