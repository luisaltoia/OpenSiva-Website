import { useRef, useState, useEffect, useCallback } from "react";
import { ReactLenis, useLenis } from "lenis/react";

const stages = [
  {
    num: 1,
    name: "Map",
    body: "We study how your business actually runs. Not the org chart — the real workflows. Who makes which decisions, where the bottlenecks are, what's manual that shouldn't be, and where expertise is stuck in one person's head. Every engagement starts here.",
    color: "#6366f1",
  },
  {
    num: 2,
    name: "Diagnose",
    body: "We identify which processes have the highest ROI if automated, which knowledge should become a product, and which decisions can be handled by an agent. Not everything needs AI. We find the areas where it pays for itself.",
    color: "#f59e0b",
  },
  {
    num: 3,
    name: "Architect",
    body: "We design the system. Data flows, integration points, decision logic, and how the AI fits into your existing operations — not beside them. Every solution is scoped against a clear return before a single line of code is written.",
    color: "#10b981",
  },
  {
    num: 4,
    name: "Build",
    body: "We develop the AI products, AI Agents, or automation end to end. No handoffs to third parties. No templates. Custom infrastructure built to your operations, your data, and your rules.",
    color: "#ef4444",
  },
  {
    num: 5,
    name: "Deploy & Operate",
    body: "We launch the system into your live environment and operate it. Monitoring, maintenance, and performance tracking against the ROI targets set in the diagnostic. We don't hand over a login and disappear.",
    color: "#3b82f6",
  },
  {
    num: 6,
    name: "Scale",
    body: "Once the first systems prove their return, we expand. More processes. More automation. Higher AI maturity across the business. Each phase is driven by results from the last — not a roadmap written before we learned anything.",
    color: "#a855f7",
  },
];

function SliderContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollAccumulatorRef = useRef(0);
  const hasEnteredRef = useRef(false);
  const slideCount = stages.length;
  const SCROLL_THRESHOLD = 50;

  const lenis = useLenis();

  const getSlideScrollPosition = useCallback(
    (slideIndex: number) => {
      if (!containerRef.current) return 0;
      const container = containerRef.current;
      const sectionTop = container.offsetTop;
      const scrollableDistance = container.offsetHeight - window.innerHeight;
      return sectionTop + scrollableDistance * (slideIndex / (slideCount - 1));
    },
    [slideCount]
  );

  const snapToSlide = useCallback(
    (slideIndex: number) => {
      if (slideIndex < 0 || slideIndex >= slideCount || isAnimating || !lenis)
        return;
      setCurrentSlide(slideIndex);
      setIsAnimating(true);
      scrollAccumulatorRef.current = 0;
      lenis.scrollTo(getSlideScrollPosition(slideIndex), {
        duration: 0.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        lock: true,
        onComplete: () => setIsAnimating(false),
      });
    },
    [slideCount, isAnimating, lenis, getSlideScrollPosition]
  );

  // Decay accumulator
  useEffect(() => {
    const interval = setInterval(() => {
      scrollAccumulatorRef.current *= 0.92;
      if (Math.abs(scrollAccumulatorRef.current) < 1)
        scrollAccumulatorRef.current = 0;
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Track scroll progress
  useLenis((l) => {
    if (!containerRef.current) return;
    const scroll = l.scroll;
    const container = containerRef.current;
    const sectionTop = container.offsetTop;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    const newProgress = Math.max(
      0,
      Math.min(1, (scroll - sectionTop) / scrollableDistance)
    );
    setProgress(newProgress);

    if (
      !hasEnteredRef.current &&
      scroll >= sectionTop - 50 &&
      scroll < sectionTop + 200
    ) {
      hasEnteredRef.current = true;
      snapToSlide(0);
    }

    if (scroll < sectionTop - window.innerHeight) {
      hasEnteredRef.current = false;
      setCurrentSlide(0);
      setIsAnimating(false);
      scrollAccumulatorRef.current = 0;
    }
  });

  // Virtual scroll handler for snap behavior
  useEffect(() => {
    if (!lenis) return;

    const handleVirtualScroll = (e: any) => {
      if (!containerRef.current) return;
      const scroll = lenis.scroll;
      const container = containerRef.current;
      const sectionTop = container.offsetTop;
      const sectionBottom =
        sectionTop + container.offsetHeight - window.innerHeight;

      if (scroll >= sectionTop - 50 && scroll <= sectionBottom + 50) {
        e.preventDefault();
        if (!isAnimating) {
          scrollAccumulatorRef.current += e.deltaY;
          if (scrollAccumulatorRef.current > SCROLL_THRESHOLD)
            snapToSlide(currentSlide + 1);
          else if (scrollAccumulatorRef.current < -SCROLL_THRESHOLD)
            snapToSlide(currentSlide - 1);
        }
      }
    };

    lenis.on("virtual-scroll", handleVirtualScroll);
    return () => lenis.off("virtual-scroll", handleVirtualScroll);
  }, [lenis, isAnimating, currentSlide, snapToSlide]);

  const translateX = progress * (slideCount - 1) * -100;
  const displayIndex = Math.min(
    Math.round(progress * (slideCount - 1)),
    slideCount - 1
  );

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${slideCount * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-foreground">
        {/* Header: counter + progress + stage names */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-8 md:px-12">
          {/* Counter */}
          <div className="text-xs font-light tracking-widest text-background/40">
            <span className="text-background font-medium text-base">
              {String(displayIndex + 1).padStart(2, "0")}
            </span>
            <span> / {String(slideCount).padStart(2, "0")}</span>
          </div>

          {/* Progress line */}
          <div className="flex-1 max-w-[200px] mx-8">
            <div className="h-px bg-background/15 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-background transition-[width] duration-150 ease-out"
                style={{ width: `${progress * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-background rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
          </div>

          {/* Stage names */}
          <div className="hidden md:flex gap-6 text-[0.7rem] uppercase tracking-[0.15em]">
            {stages.map((s, i) => (
              <span
                key={s.num}
                className="transition-colors duration-300"
                style={{
                  color:
                    i === displayIndex
                      ? "hsl(var(--background))"
                      : "hsl(var(--background) / 0.3)",
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-100 ease-out"
          style={{ transform: `translateX(${translateX}vw)` }}
        >
          {stages.map((stage, index) => (
            <div
              key={stage.num}
              className="min-w-[100vw] h-full flex flex-col items-center justify-center p-8 text-center relative"
            >
              {/* Giant background number */}
              <span
                className="absolute font-bold text-background/[0.03] select-none leading-none"
                style={{
                  fontSize: "clamp(15rem, 40vw, 30rem)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div
                className="relative z-10 max-w-[700px] transition-all duration-700"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  opacity: index === displayIndex ? 1 : 0,
                  transform: `translateY(${index === displayIndex ? 0 : 40}px)`,
                }}
              >
                <p className="text-xs text-background/50 uppercase tracking-[0.2em] mb-4 font-light">
                  Stage {stage.num}
                </p>
                <h2
                  className="font-light text-architectural text-background mb-0"
                  style={{
                    fontSize: "clamp(2.5rem, 8vw, 5rem)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {stage.name}
                </h2>
                {/* Color accent line */}
                <div
                  className="mx-auto mt-6 mb-6 h-px w-[60px] transition-transform duration-500"
                  style={{
                    background: stage.color,
                    transitionTimingFunction:
                      "cubic-bezier(0.16, 1, 0.3, 1)",
                    transitionDelay: "0.3s",
                    transform: `scaleX(${index === displayIndex ? 1 : 0})`,
                  }}
                />
                <p className="text-background/60 leading-relaxed text-sm md:text-base max-w-[520px] mx-auto">
                  {stage.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {stages.map((stage, i) => (
            <div
              key={stage.num}
              className="w-10 h-px relative overflow-hidden"
              style={{ background: "hsl(var(--background) / 0.2)" }}
            >
              <div
                className="absolute left-0 top-0 h-full transition-[width] duration-400 ease-out"
                style={{
                  width: i <= displayIndex ? "100%" : "0%",
                  background:
                    i === displayIndex
                      ? stage.color
                      : "hsl(var(--background) / 0.5)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HorizontalMethodology = () => {
  return (
    <ReactLenis root options={{ lerp: 0.07, smoothWheel: true }}>
      <SliderContent />
    </ReactLenis>
  );
};

export default HorizontalMethodology;
