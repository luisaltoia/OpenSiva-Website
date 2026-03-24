import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stages = [
  {
    num: 1,
    name: "Map",
    body: "We study how your business actually runs. Not the org chart — the real workflows. Who makes which decisions, where the bottlenecks are, what's manual that shouldn't be, and where expertise is stuck in one person's head. Every engagement starts here.",
    color: "#6366f1", // indigo
  },
  {
    num: 2,
    name: "Diagnose",
    body: "We identify which processes have the highest ROI if automated, which knowledge should become a product, and which decisions can be handled by an agent. Not everything needs AI. We find the areas where it pays for itself.",
    color: "#f59e0b", // amber
  },
  {
    num: 3,
    name: "Architect",
    body: "We design the system. Data flows, integration points, decision logic, and how the AI fits into your existing operations — not beside them. Every solution is scoped against a clear return before a single line of code is written.",
    color: "#10b981", // emerald
  },
  {
    num: 4,
    name: "Build",
    body: "We develop the AI products, agents, or automation end to end. No handoffs to third parties. No templates. Custom infrastructure built to your operations, your data, and your rules.",
    color: "#ef4444", // red
  },
  {
    num: 5,
    name: "Deploy & Operate",
    body: "We launch the system into your live environment and operate it. Monitoring, maintenance, and performance tracking against the ROI targets set in the diagnostic. We don't hand over a login and disappear.",
    color: "#3b82f6", // blue
  },
  {
    num: 6,
    name: "Scale",
    body: "Once the first systems prove their return, we expand. More processes. More automation. Higher AI maturity across the business. Each phase is driven by results from the last — not a roadmap written before we learned anything.",
    color: "#a855f7", // purple
  },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const TITLE_END = 0.12;

const getActiveIndex = (progress: number) => {
  const p = clamp((progress - TITLE_END) / (1 - TITLE_END), 0, 1);
  return Math.round(p * (stages.length - 1));
};

/* ── Progress Bar ── */
const ProgressBar = ({ activeIndex }: { activeIndex: number }) => {
  const segmentCount = stages.length;
  return (
    <div className="flex gap-1.5 w-full max-w-md mx-auto">
      {stages.map((stage, i) => (
        <motion.div
          key={stage.num}
          className="h-1 flex-1 rounded-full"
          animate={{
            backgroundColor: i <= activeIndex ? stage.color : "hsl(var(--border))",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

/* ── Stage Card ── */
const StageCard = ({
  stage,
  isActive,
}: {
  stage: (typeof stages)[0];
  isActive: boolean;
}) => (
  <motion.article
    className="flex-shrink-0 h-[50vh] min-h-[340px] max-h-[440px] rounded-2xl border overflow-hidden flex flex-col justify-between"
    style={{
      borderColor: isActive ? stage.color : "hsl(var(--border))",
    }}
    animate={{
      width: isActive ? 520 : 140,
      backgroundColor: isActive
        ? "hsl(var(--foreground))"
        : "hsl(var(--foreground) / 0.6)",
    }}
    transition={{ type: "spring", stiffness: 400, damping: 35 }}
  >
    <div className="p-6 md:p-8 pb-0">
      <motion.div
        className="h-1 w-10 rounded-full mb-4"
        animate={{ backgroundColor: stage.color }}
        transition={{ duration: 0.3 }}
      />
      <span className="text-xs tracking-widest uppercase font-medium text-background/50 whitespace-nowrap">
        Stage {stage.num}
      </span>
    </div>

    <div className="mt-auto p-6 md:p-8 pt-0">
      <h3
        className={`font-light text-architectural text-background ${
          isActive ? "text-2xl md:text-3xl" : "text-sm"
        }`}
      >
        {stage.name}
      </h3>
      {isActive && (
        <motion.p
          className="text-background/60 leading-relaxed text-sm mt-3 max-w-[440px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {stage.body}
        </motion.p>
      )}
    </div>
  </motion.article>
);

/* ── Main Component ── */
const HorizontalMethodology = () => {
  const containerRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);
  const progressRef = useRef(0);
  const [isLocked, setIsLocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const titleOpacity = useTransform(progress, [0, 0.06, TITLE_END], [1, 1, 0], {
    clamp: true,
  });
  const titleScale = useTransform(progress, [0, TITLE_END], [1, 0.97], {
    clamp: true,
  });
  const cardsOpacity = useTransform(progress, [0.04, 0.14], [0, 1], {
    clamp: true,
  });

  const setProgressValue = (next: number) => {
    const clamped = clamp(next, 0, 1);
    progressRef.current = clamped;
    progress.set(clamped);
    setActiveIndex(getActiveIndex(clamped));
  };

  /* Lock when section reaches top of viewport */
  useEffect(() => {
    let previousTop: number | null = null;

    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const currentTop = rect.top;
      if (isLocked) return;

      const isNearTop = currentTop <= 50 && currentTop >= -50;
      if (isNearTop) {
        const crossedFromAbove =
          previousTop !== null && previousTop > 50 && currentTop <= 50;
        const crossedFromBelow =
          previousTop !== null && previousTop < -50 && currentTop >= -50;
        if (crossedFromAbove || crossedFromBelow || previousTop === null) {
          setIsLocked(true);
          setProgressValue(0);
        }
      }
      previousTop = currentTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLocked]);

  /* Handle scroll while locked — cooldown approach */
  useEffect(() => {
    if (!isLocked) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let accumulatedDelta = 0;
    let cooldownUntil = 0;
    const THRESHOLD = 50;
    const COOLDOWN_MS = 400;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now < cooldownUntil) return;

      accumulatedDelta += e.deltaY;

      if (Math.abs(accumulatedDelta) >= THRESHOLD) {
        const direction = Math.sign(accumulatedDelta);
        accumulatedDelta = 0;
        cooldownUntil = now + COOLDOWN_MS;

        // Unlock upward at title
        if (progressRef.current <= TITLE_END && direction < 0) {
          setIsLocked(false);
          setProgressValue(0);
          document.body.style.overflow = prevOverflow;
          setTimeout(() => {
            window.scrollBy({
              top: -window.innerHeight * 0.5,
              behavior: "smooth",
            });
          }, 50);
          return;
        }

        // Unlock downward at last stage
        if (progressRef.current >= 1 && direction > 0) {
          setIsLocked(false);
          document.body.style.overflow = prevOverflow;
          setTimeout(() => {
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
          }, 50);
          return;
        }

        // Title → first stage
        if (progressRef.current < TITLE_END && direction > 0) {
          setProgressValue(TITLE_END);
          return;
        }

        // First stage → title
        if (progressRef.current <= TITLE_END && direction < 0) {
          setProgressValue(0);
          return;
        }

        // Normal stage navigation
        const currentIdx = getActiveIndex(progressRef.current);
        const targetIdx = clamp(currentIdx + direction, 0, stages.length - 1);
        const segments = stages.length - 1;
        const targetProgress = targetIdx / segments;
        const finalProgress = clamp(
          targetProgress * (1 - TITLE_END) + TITLE_END,
          0,
          1
        );
        setProgressValue(finalProgress);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("wheel", onWheel);
    };
  }, [isLocked]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 min-h-screen bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative z-20 h-screen overflow-hidden bg-background flex flex-col">
        {/* Progress bar */}
        <div className="pt-12 px-6">
          <motion.div style={{ opacity: cardsOpacity }}>
            <ProgressBar activeIndex={activeIndex} />
          </motion.div>
        </div>

        {/* Title overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{ opacity: titleOpacity, scale: titleScale }}
        >
          <h2 className="text-4xl md:text-6xl font-light text-architectural text-center text-foreground">
            How we build.
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="flex-1 flex items-center justify-center"
          style={{ opacity: cardsOpacity }}
        >
          <div className="flex gap-4">
            {stages.map((stage, i) => (
              <StageCard
                key={stage.num}
                stage={stage}
                isActive={i === activeIndex}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalMethodology;
