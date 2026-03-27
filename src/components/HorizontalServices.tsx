import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Bot, Workflow } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    label: "AI SYSTEMS",
    headline: "Your expertise becomes a product.",
    body: "We build AI platforms that take what your team knows and deliver it at scale. Your knowledge becomes a subscription product that works around the clock.",
    icon: Cpu,
    accent: "#6366f1",
  },
  {
    id: 2,
    label: "AGENTS",
    headline: "Systems that act, not just answer.",
    body: "We build AI agents that execute workflows, route decisions, and operate within your rules. Not chatbots. Operating systems for your business.",
    icon: Bot,
    accent: "#10b981",
  },
  {
    id: 3,
    label: "AUTOMATION",
    headline: "Remove the manual. Keep the control.",
    body: "We automate business processes end to end. Data pipelines, approval workflows, reporting, integrations. What used to take a team now runs on infrastructure.",
    icon: Workflow,
    accent: "#f59e0b",
  },
];

// intro (0) + 3 slides (1,2,3) = 4 states
const TOTAL_STATES = 4;
const VH_PER_STATE = 60;

const HorizontalServices = () => {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${(TOTAL_STATES - 1) * window.innerHeight * (VH_PER_STATE / 100)}`,
        pin: stickyRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          // Determine state based on even distribution
          const state = Math.round(p * (TOTAL_STATES - 1));
          setActiveIndex(state === 0 ? -1 : state - 1);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth opacity transitions
  const introOpacity = progress <= 0.05 ? 1 : progress >= 0.2 ? 0 : 1 - (progress - 0.05) / 0.15;
  const slidesOpacity = progress <= 0.1 ? 0 : progress >= 0.25 ? 1 : (progress - 0.1) / 0.15;

  return (
    <section
      ref={containerRef}
      className="relative z-40 bg-background"
      style={{ height: `${TOTAL_STATES * VH_PER_STATE}vh` }}
    >
      <div ref={stickyRef} className="h-screen overflow-hidden bg-background">

        {/* Intro Title */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{
            opacity: Math.max(0, introOpacity),
            transform: `scale(${1 - progress * 0.05})`,
          }}
        >
          <h2 className="text-4xl md:text-6xl font-light text-architectural text-center text-foreground">
            Three ways to stop being the bottleneck.
          </h2>
        </div>

        {/* Full-screen slides */}
        <div
          className="absolute inset-0"
          style={{ opacity: Math.max(0, Math.min(1, slidesOpacity)) }}
        >
          {services.map((service, i) => {
            const Icon = service.icon;
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            const isFuture = i > activeIndex;

            return (
              <div
                key={service.id}
                className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isPast
                    ? 'translateY(-100%)'
                    : isFuture
                      ? 'translateY(100%)'
                      : 'translateY(0)',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `radial-gradient(ellipse at 30% 50%, ${service.accent}40 0%, transparent 60%)`,
                  }}
                />

                {/* Giant background number */}
                <div className="absolute inset-0 flex items-center justify-end pr-[5%] pointer-events-none overflow-hidden">
                  <span
                    className="font-bold select-none"
                    style={{
                      fontSize: 'clamp(25rem, 55vw, 50rem)',
                      lineHeight: 0.8,
                      color: `${service.accent}08`,
                    }}
                  >
                    {String(service.id).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-6 md:px-12 flex items-center">
                  <div className="max-w-2xl">
                    {/* Label with icon */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="p-3 rounded-xl"
                        style={{ background: `${service.accent}20` }}
                      >
                        <Icon
                          style={{ color: service.accent }}
                          size={24}
                          strokeWidth={1.5}
                        />
                      </div>
                      <span
                        className="text-xs tracking-widest uppercase font-medium"
                        style={{ color: service.accent }}
                      >
                        {service.label}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3
                      className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: isActive ? '0.1s' : '0s',
                      }}
                    >
                      {service.headline}
                    </h3>

                    {/* Body */}
                    <p
                      className="text-lg md:text-xl text-foreground/60 leading-relaxed max-w-lg"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: isActive ? '0.2s' : '0s',
                      }}
                    >
                      {service.body}
                    </p>

                    {/* Accent line */}
                    <div
                      className="mt-8 h-[2px] rounded-full transition-all duration-700"
                      style={{
                        width: isActive ? '80px' : '0px',
                        background: service.accent,
                        transitionDelay: isActive ? '0.3s' : '0s',
                      }}
                    />
                  </div>
                </div>

                {/* Slide number - bottom left */}
                <div className="absolute bottom-8 left-6 md:left-12 flex items-center gap-4">
                  <span className="text-5xl md:text-6xl font-light" style={{ color: service.accent }}>
                    {String(service.id).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground/40 tracking-widest uppercase">Service</span>
                    <span className="text-sm text-foreground/60">{service.id} of {services.length}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Progress dots - right side (hidden on mobile/tablet) */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
            {services.map((service, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
              >
                <span
                  className="text-[10px] tracking-widest uppercase transition-all duration-500"
                  style={{
                    opacity: i === activeIndex ? 1 : 0.3,
                    color: i === activeIndex ? service.accent : 'currentColor',
                  }}
                >
                  {service.label}
                </span>
                <div
                  className="w-8 h-[2px] rounded-full transition-all duration-500"
                  style={{
                    background: i === activeIndex ? service.accent : 'rgba(255,255,255,0.2)',
                    transform: i === activeIndex ? 'scaleX(1.5)' : 'scaleX(1)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
            style={{ opacity: activeIndex < services.length - 1 ? 0.4 : 0 }}
          >
            <span className="text-[10px] tracking-widest uppercase text-foreground/40">Scroll</span>
            <div className="w-px h-6 bg-gradient-to-b from-foreground/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalServices;
