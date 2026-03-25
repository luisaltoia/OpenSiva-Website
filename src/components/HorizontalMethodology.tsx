import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

// intro (0) + 6 stages = 7 states
const TOTAL_STATES = 7;
const VH_PER_STATE = 55; // scroll distance per state

const HorizontalMethodology = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [displayIndex, setDisplayIndex] = useState(-1); // -1 = intro
  const [progress, setProgress] = useState(0);
  const slideCount = stages.length;

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${(TOTAL_STATES - 1) * window.innerHeight * (VH_PER_STATE / 100)}`,
        pin: stickyRef.current,
        scrub: 0.3,
        snap: {
          snapTo: 1 / (TOTAL_STATES - 1),
          duration: { min: 0.15, max: 0.3 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          const state = Math.round(p * (TOTAL_STATES - 1));
          setDisplayIndex(state === 0 ? -1 : state - 1);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const introOpacity = progress <= 0.05 ? 1 : progress >= 0.15 ? 0 : 1 - (progress - 0.05) / 0.1;
  const slidesOpacity = progress <= 0.08 ? 0 : progress >= 0.18 ? 1 : (progress - 0.08) / 0.1;

  // Container needs: scroll distance + one screen height for the pinned element
  const scrollDistance = (TOTAL_STATES - 1) * VH_PER_STATE;
  const containerHeight = scrollDistance + 100; // +100vh for the pinned screen

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${containerHeight}vh` }}
      data-lenis-prevent
    >
      <div
        ref={stickyRef}
        className="h-screen w-full overflow-hidden bg-foreground"
      >
        {/* Intro Title */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none z-10"
          style={{
            opacity: Math.max(0, introOpacity),
            transform: `scale(${1 - progress * 0.05})`,
          }}
        >
          <div className="text-center">
            <p className="text-xs text-background/40 uppercase tracking-[0.3em] mb-4">
              Our Process
            </p>
            <h2 className="text-4xl md:text-6xl font-light text-architectural text-background">
              From diagnosis to deployment.
            </h2>
          </div>
        </div>

        {/* Slides section */}
        <div
          className="absolute inset-0"
          style={{ opacity: Math.max(0, Math.min(1, slidesOpacity)) }}
        >
          {/* Header: counter + progress + stage names */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 pt-8 md:px-12">
            {/* Counter */}
            <div className="text-xs font-light tracking-widest text-background/40">
              <span className="text-background font-medium text-base">
                {String(Math.max(1, displayIndex + 1)).padStart(2, "0")}
              </span>
              <span> / {String(slideCount).padStart(2, "0")}</span>
            </div>

            {/* Progress line */}
            <div className="flex-1 max-w-[200px] mx-8">
              <div className="h-px bg-background/15 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-background transition-[width] duration-150 ease-out"
                  style={{ width: `${Math.max(0, (displayIndex + 1) / slideCount) * 100}%` }}
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
          {stages.map((stage, index) => {
            const isActive = index === displayIndex;
            const isPast = index < displayIndex;
            const isFuture = index > displayIndex;

            return (
              <div
                key={stage.num}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-700"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isPast
                    ? 'translateX(-100%)'
                    : isFuture
                      ? 'translateX(100%)'
                      : 'translateX(0)',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
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
                  className="relative z-10 max-w-[700px]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: isActive ? '0.1s' : '0s',
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
                    className="mx-auto mt-6 mb-6 h-px w-[60px] transition-all duration-700"
                    style={{
                      background: stage.color,
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transitionDelay: isActive ? '0.2s' : '0s',
                    }}
                  />
                  <p className="text-background/60 leading-relaxed text-sm md:text-base max-w-[520px] mx-auto">
                    {stage.body}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Bottom progress dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50">
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
    </div>
  );
};

export default HorizontalMethodology;
