import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Cpu, Bot, Workflow } from "lucide-react";

const services = [
  {
    id: 1,
    label: "AI SYSTEMS",
    headline: "Your expertise becomes a product.",
    body: "We build AI platforms that take what your team knows and deliver it at scale. Your knowledge becomes a subscription product that works around the clock.",
    icon: Cpu,
  },
  {
    id: 2,
    label: "AGENTS",
    headline: "Systems that act, not just answer.",
    body: "We build AI agents that execute workflows, route decisions, and operate within your rules. Not chatbots. Operating systems for your business.",
    icon: Bot,
  },
  {
    id: 3,
    label: "AUTOMATION",
    headline: "Remove the manual. Keep the control.",
    body: "We automate business processes end to end. Data pipelines, approval workflows, reporting, integrations. What used to take a team now runs on infrastructure.",
    icon: Workflow,
  },
];

const EXPANDED_WIDTH = 520;
const COLLAPSED_WIDTH = 160;
const GAP = 16;
const SCROLL_DEBOUNCE_MS = 150;
const MIN_SCROLL_THRESHOLD = 30;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getActiveIndex = (progress: number) => {
  const cardProgress = clamp((progress - 0.16) / 0.84, 0, 1);
  const segments = services.length - 1;
  return Math.round(cardProgress * segments);
};

const ServiceCard = ({
  service,
  isActive,
}: {
  service: (typeof services)[0];
  isActive: boolean;
}) => {
  const Icon = service.icon;

  return (
    <motion.article
      className="flex-shrink-0 h-[50vh] min-h-[320px] max-h-[420px] rounded-2xl border border-background/10 bg-foreground text-background overflow-hidden"
      animate={{ width: isActive ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="p-6 md:p-8 pb-0">
          <Icon
            className="text-background drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            size={isActive ? 32 : 24}
            strokeWidth={1.5}
          />
        </div>
        <div className="mt-auto p-6 md:p-8 pt-0">
          <span className="inline-block text-background/60 text-xs tracking-widest uppercase font-medium mb-3 whitespace-nowrap">
            0{service.id}
          </span>
          <h3 className={`font-light text-architectural text-background ${isActive ? "text-2xl md:text-3xl" : "text-sm"}`}>
            {service.label}
          </h3>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <p className="text-base font-light text-background/85 mb-2 mt-2">{service.headline}</p>
              <p className="text-background/60 leading-relaxed text-sm">{service.body}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const HorizontalServices = () => {
  const containerRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);
  const progressRef = useRef(0);
  const [isLocked, setIsLocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const debounceTimerRef = useRef<number | null>(null);
  const accumulatedDeltaRef = useRef(0);

  const titleOpacity = useTransform(progress, [0, 0.08, 0.16], [1, 1, 0], { clamp: true });
  const titleScale = useTransform(progress, [0, 0.16], [1, 0.97], { clamp: true });
  const cardsOpacity = useTransform(progress, [0.05, 0.18], [0, 1], { clamp: true });

  const setProgressValue = (next: number) => {
    const clamped = clamp(next, 0, 1);
    progressRef.current = clamped;
    progress.set(clamped);
    setActiveIndex(getActiveIndex(clamped));
  };

  // Lock when section reaches top of viewport
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
        const crossedFromAbove = previousTop !== null && previousTop > 50 && currentTop <= 50;
        const crossedFromBelow = previousTop !== null && previousTop < -50 && currentTop >= -50;

        if (crossedFromAbove || crossedFromBelow || previousTop === null) {
          console.log("🔒 LOCKING - Section reached top", { currentTop, previousTop });
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

  // Handle scroll while locked
  useEffect(() => {
    console.log("🎯 Wheel handler effect running, isLocked:", isLocked);
    if (!isLocked) return;
    console.log("✅ Lock is active, installing wheel handler");

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const executeSlideChange = () => {
      const totalDelta = accumulatedDeltaRef.current;
      accumulatedDeltaRef.current = 0;
      
      if (!isLocked) return;
      
      if (Math.abs(totalDelta) < MIN_SCROLL_THRESHOLD) {
        console.log("⚠️ Delta too small, ignoring:", totalDelta);
        return;
      }

      console.log("✅ Executing slide change, delta:", totalDelta);

      const direction = Math.sign(totalDelta);

      // UNLOCK: At headline scrolling up
      if (progressRef.current <= 0.16 && direction < 0) {
        console.log("🔓 Unlocking upward");
        setIsLocked(false);
        setProgressValue(0);
        document.body.style.overflow = prevOverflow;
        setTimeout(() => {
          window.scrollBy({ top: -window.innerHeight * 0.5, behavior: "smooth" });
        }, 50);
        return;
      }

      // UNLOCK: At last slide scrolling down
      if (progressRef.current >= 1 && direction > 0) {
        console.log("🔓 Unlocking downward");
        setIsLocked(false);
        document.body.style.overflow = prevOverflow;
        setTimeout(() => {
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }, 50);
        return;
      }

      // HEADLINE → FIRST SLIDE
      if (progressRef.current < 0.16 && direction > 0) {
        console.log("📍 Headline → First slide");
        setProgressValue(0.16);
        return;
      }

      // FIRST SLIDE → HEADLINE
      if (progressRef.current <= 0.16 && direction < 0) {
        console.log("📍 First slide → Headline");
        setProgressValue(0);
        return;
      }

      // NORMAL SLIDE NAVIGATION
      const currentIndex = getActiveIndex(progressRef.current);
      const targetIndex = clamp(currentIndex + direction, 0, services.length - 1);

      const segments = services.length - 1;
      const targetProgress = targetIndex / segments;
      const finalProgress = clamp(targetProgress * 0.84 + 0.16, 0, 1);

      console.log("📍 Slide change:", currentIndex, "→", targetIndex);
      setProgressValue(finalProgress);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      console.log("🔄 Wheel event captured, delta:", e.deltaY);

      accumulatedDeltaRef.current += e.deltaY;

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(executeSlideChange, SCROLL_DEBOUNCE_MS);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("wheel", onWheel);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [isLocked]);

  return (
    <section
      ref={containerRef}
      className="relative z-40 min-h-screen bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="relative z-40 h-screen overflow-hidden bg-background">
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{ opacity: titleOpacity, scale: titleScale }}
        >
          <h2 className="text-4xl md:text-6xl font-light text-architectural text-center text-foreground">
            Three ways to stop being the bottleneck.
          </h2>
        </motion.div>

        <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: cardsOpacity }}>
          <div className="flex" style={{ gap: GAP }}>
            {services.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                isActive={i === activeIndex}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalServices;
