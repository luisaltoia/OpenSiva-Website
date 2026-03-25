import { useEffect, useRef, useMemo } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface Dot {
  x: number;
  y: number;
  tier: "base" | "sparkle";
  sparkleSpeed?: number;
  sparkleOffset?: number;
}

const DOT_SIZE = 6;
const GAP = 2;
const STEP = DOT_SIZE + GAP;
const BASE_HEIGHT = 5;
const SPARKLE_ZONE = 14;
const TOTAL_HEIGHT = BASE_HEIGHT + SPARKLE_ZONE;

// Seeded random for consistent dot placement
const seeded = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

interface Props {
  scrollProgress: MotionValue<number>;
}

const ParallaxPixelsCanvas = ({ scrollProgress }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  // Generate dots once on mount
  const dots = useMemo<Dot[]>(() => {
    const arr: Dot[] = [];
    const cols = Math.ceil(2000 / STEP);

    for (let c = 0; c < cols; c++) {
      const t = c / cols;
      const wave =
        Math.sin(t * Math.PI * 4) * 1.5 +
        Math.sin(t * Math.PI * 9 + 1) * 0.8 +
        Math.sin(t * Math.PI * 23 + 3.7) * 1.2 +
        (seeded(c * 7 + 13) - 0.5) * 3.5;
      const baseH = Math.max(3, Math.round(BASE_HEIGHT + wave));

      const hasOutlier1 = seeded(c * 3001 + 7) < 0.3;
      const hasOutlier2 = seeded(c * 4001 + 11) < 0.15;
      const outlierMax = baseH + (hasOutlier1 ? Math.round(1 + seeded(c * 5001) * 3) : 0);
      const outlierMax2 = hasOutlier2 ? outlierMax + Math.round(1 + seeded(c * 6001) * 2) : outlierMax;
      const effectiveH = Math.min(outlierMax2, TOTAL_HEIGHT - 2);

      // Base dots
      for (let r = 0; r < effectiveH; r++) {
        if (r >= baseH) {
          const edgeDist = (r - baseH) / (effectiveH - baseH + 1);
          const keepChance = (1 - edgeDist) * (1 - edgeDist);
          if (seeded(c * 811 + r * 67) > keepChance) continue;
        }

        const blinkChance = r < effectiveH / 2 ? 0.2 : 0.3;
        const shouldSparkle = seeded(c * 9911 + r * 37) < blinkChance;

        arr.push({
          x: c * STEP,
          y: r * STEP,
          tier: shouldSparkle ? "sparkle" : "base",
          sparkleSpeed: shouldSparkle ? 8 + seeded(c * 1337 + r * 47) * 6 : undefined,
          sparkleOffset: shouldSparkle ? seeded(c * 3321 + r * 61) * Math.PI * 2 : undefined,
        });
      }

      // Sparkle zone dots
      for (let r = baseH; r < baseH + SPARKLE_ZONE; r++) {
        const distFromBase = r - baseH;
        const distNorm = distFromBase / SPARKLE_ZONE;
        const prob = 1 - distNorm;
        const chance = prob * prob * prob * 0.45;

        if (seeded(c * 1000 + r * 7 + 3) < chance) {
          arr.push({
            x: c * STEP,
            y: r * STEP,
            tier: "sparkle",
            sparkleSpeed: 2 + seeded(c * 1337 + r * 47) * 6,
            sparkleOffset: seeded(c * 2221 + r * 89) * Math.PI * 2,
          });
        }
      }
    }

    return arr;
  }, []);

  // Calculate sparkle opacity
  const getSparkleOpacity = (time: number, dot: Dot): number => {
    if (dot.tier !== "sparkle") return 1;

    const speed = dot.sparkleSpeed ?? 10;
    const offset = dot.sparkleOffset ?? 0;
    const phase = ((time / speed) + offset / (Math.PI * 2)) % 1;

    const offFraction = Math.min(2 / speed, 0.25);
    const fadeFraction = offFraction * 0.4;
    const onEnd = 1 - offFraction;
    const fadeOutEnd = onEnd + fadeFraction;
    const fadeInEnd = fadeFraction;

    if (phase < fadeInEnd) return phase / fadeInEnd;
    if (phase < onEnd) return 1;
    if (phase < fadeOutEnd) return 1 - (phase - onEnd) / fadeFraction;
    return 0;
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const containerHeight = TOTAL_HEIGHT * STEP;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 2000 * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = "2000px";
    canvas.style.height = `${containerHeight}px`;
    ctx.scale(dpr, dpr);

    const render = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const time = (timestamp - startTimeRef.current) / 1000;

      // Clear canvas
      ctx.clearRect(0, 0, 2000, containerHeight);

      // Draw all dots
      ctx.fillStyle = "hsl(0, 0%, 100%)"; // primary-foreground color

      for (const dot of dots) {
        const opacity = getSparkleOpacity(time, dot);
        if (opacity < 0.01) continue; // Skip invisible dots

        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(
          dot.x + DOT_SIZE / 2,
          containerHeight - dot.y - DOT_SIZE / 2,
          DOT_SIZE / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dots]);

  const containerHeight = TOTAL_HEIGHT * STEP;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 30, height: containerHeight }}
    >
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: containerHeight }}
      />
    </div>
  );
};

export default ParallaxPixelsCanvas;
