import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    id: 1,
    label: "PRODUCTS",
    headline: "Your expertise becomes a product.",
    body: "We build AI platforms that take what your team knows and deliver it at scale. Your knowledge becomes a subscription product that works around the clock.",
  },
  {
    id: 2,
    label: "AGENTS",
    headline: "Systems that act, not just answer.",
    body: "We build AI agents that execute workflows, route decisions, and operate within your rules. Not chatbots. Operating systems for your business.",
  },
  {
    id: 3,
    label: "AUTOMATION",
    headline: "Remove the manual. Keep the control.",
    body: "We automate business processes end to end. Data pipelines, approval workflows, reporting, integrations. What used to take a team now runs on infrastructure.",
  },
];

const ITEM_WIDTH = 500;
const GAP = 32;
const WHEEL_TO_FULL_PROGRESS = 2600;
const KEY_PROGRESS_STEP = 0.08;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const HorizontalServices = () => {
  const containerRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);
  const progressRef = useRef(0);
  const releaseCooldownUntilRef = useRef(0);
  const previousTopRef = useRef<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const totalDistance = (services.length - 1) * (ITEM_WIDTH + GAP);

  const titleOpacity = useTransform(progress, [0, 0.08, 0.16], [1, 1, 0], { clamp: true });
  const titleScale = useTransform(progress, [0, 0.16], [1, 0.97], { clamp: true });
  const cardsOpacity = useTransform(progress, [0.05, 0.18], [0, 1], { clamp: true });
  const x = useTransform(progress, [0, 1], [0, -totalDistance], { clamp: true });

  const setProgress = (next: number) => {
    const clamped = clamp(next, 0, 1);
    progressRef.current = clamped;
    progress.set(clamped);
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

        <motion.div className="absolute inset-0 flex items-center" style={{ opacity: cardsOpacity }}>
          <motion.div
            className="flex"
            style={{
              x,
              gap: GAP,
              paddingLeft: "calc(50vw - 250px)",
              paddingRight: "calc(50vw - 250px)",
            }}
          >
            {services.map((service) => (
              <article
                key={service.id}
                className="flex-shrink-0 h-[70vh] min-h-[460px] rounded-2xl border border-background/10 bg-foreground text-background overflow-hidden"
                style={{ width: ITEM_WIDTH }}
              >
                <div className="h-full flex flex-col justify-end p-8 md:p-10">
                  <span className="inline-block text-background/60 text-xs tracking-widest uppercase font-medium mb-4">
                    0{service.id}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-light text-architectural mb-3 text-background">
                    {service.label}
                  </h3>
                  <p className="text-lg font-light text-background/85 mb-3">{service.headline}</p>
                  <p className="text-background/60 leading-relaxed text-sm">{service.body}</p>
                </div>
              </article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalServices;
