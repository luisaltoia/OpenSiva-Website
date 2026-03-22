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
const WHEEL_TO_FULL_PROGRESS = 2600;
const KEY_PROGRESS_STEP = 0.08;

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
        {/* Icon at top */}
        <div className="p-6 md:p-8 pb-0">
          <Icon
            className="text-background drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            size={isActive ? 32 : 24}
            strokeWidth={1.5}
          />
        </div>

        {/* Content at bottom */}
        <div className="mt-auto p-6 md:p-8 pt-0">
          <span className="inline-block text-background/60 text-xs tracking-widest uppercase font-medium mb-3 whitespace-nowrap">
            0{service.id}
          </span>
          <h3 className={`font-light text-architectural text-background whitespace-nowrap overflow-hidden ${isActive ? "text-2xl md:text-3xl" : "text-lg"}`}>
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
  const releaseCooldownUntilRef = useRef(0);
  const previousTopRef = useRef<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const titleOpacity = useTransform(progress, [0, 0.08, 0.16], [1, 1, 0], { clamp: true });
  const titleScale = useTransform(progress, [0, 0.16], [1, 0.97], { clamp: true });
  const cardsOpacity = useTransform(progress, [0.05, 0.18], [0, 1], { clamp: true });

  const setProgress = (next: number) => {
    const clamped = clamp(next, 0, 1);
    progressRef.current = clamped;
    progress.set(clamped);
    setActiveIndex(getActiveIndex(clamped));
  };

  const releaseLock = (direction: "down" | "up") => {
    setIsLocked(false);
    releaseCooldownUntilRef.current = Date.now() + 250;

    const sectionTop = containerRef.current?.offsetTop ?? window.scrollY;
    const targetY =
      direction === "down"
        ? sectionTop + window.innerHeight + 4
        : Math.max(0, sectionTop - window.innerHeight * 0.65);

    window.scrollTo({ top: targetY, behavior: "auto" });
  };

  useEffect(() => {
    const checkForLock = () => {
      if (isLocked || Date.now() < releaseCooldownUntilRef.current) return;
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const previousTop = previousTopRef.current ?? rect.top;
      previousTopRef.current = rect.top;

      const crossedLockLineWhileScrollingDown = previousTop > 0 && rect.top <= 0;
      const crossedLockLineWhileScrollingUp = previousTop < 0 && rect.top >= 0;

      if (!crossedLockLineWhileScrollingDown && !crossedLockLineWhileScrollingUp) return;

      const sectionTop = rect.top + window.scrollY;
      window.scrollTo({ top: sectionTop, behavior: "auto" });
      setIsLocked(true);
    };

    window.addEventListener("scroll", checkForLock, { passive: true });
    checkForLock();

    return () => window.removeEventListener("scroll", checkForLock);
  }, [isLocked]);

  useEffect(() => {
    if (!isLocked) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const moveProgress = (delta: number) => {
      const direction = Math.sign(delta);
      const next = clamp(progressRef.current + delta / WHEEL_TO_FULL_PROGRESS, 0, 1);

      if (next >= 1 && direction > 0) {
        setProgress(1);
        releaseLock("down");
        return;
      }

      if (next <= 0 && direction < 0) {
        setProgress(0);
        releaseLock("up");
        return;
      }

      setProgress(next);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      moveProgress(event.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const currentY = event.touches[0]?.clientY ?? touchY;
      const delta = (touchY - currentY) * 2;
      touchY = currentY;
      moveProgress(delta);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const downKeys = ["ArrowDown", "PageDown", " "];
      const upKeys = ["ArrowUp", "PageUp"];

      if (downKeys.includes(event.key)) {
        event.preventDefault();
        moveProgress(WHEEL_TO_FULL_PROGRESS * KEY_PROGRESS_STEP);
      }

      if (upKeys.includes(event.key)) {
        event.preventDefault();
        moveProgress(-WHEEL_TO_FULL_PROGRESS * KEY_PROGRESS_STEP);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLocked]);

  return (
    <section
      ref={containerRef}
      className="relative z-40 min-h-screen bg-background"
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