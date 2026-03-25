import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ReactLenis } from "lenis/react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FooterCTA from "@/components/FooterCTA";
import ParallaxPixelsCanvas from "@/components/ParallaxPixelsCanvas";
import HorizontalServices from "@/components/HorizontalServices";
import HorizontalMethodology from "@/components/HorizontalMethodology";
import useScrollProgress from "@/hooks/useScrollProgress";

const Index = () => {
  /* ── Transition 1: Section B climbs over sticky Hero ── */
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroWrapRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(heroP, [0, 1], [1, 0.92]);
  const heroBlur = useTransform(heroP, [0.4, 1], [0, 10]);
  const heroOpacity = useTransform(heroP, [0.5, 0.85], [1, 0.3]);

  /* ── Transition: "The Line" section with smooth color inversion ── */
  const lineRef = useRef<HTMLElement>(null);
  const [isDark, setIsDark] = useState(false);

  const { scrollYProgress: lineP } = useScroll({
    target: lineRef,
    offset: ["start end", "center center"],
  });

  // Trigger color change when section is centered
  useMotionValueEvent(lineP, "change", (latest) => {
    // Flip to dark when text is centered (progress >= 0.95 means centered)
    setIsDark(latest >= 0.95);
  });

  // Text animations still scroll-based
  const lineTextBlur = useTransform(lineP, [0, 0.7, 1], [10, 3, 0]);
  const lineTextFilter = useTransform(lineTextBlur, (v) => `blur(${v}px)`);
  const lineTextOpacity = useTransform(lineP, [0, 0.5, 0.9], [0.3, 0.7, 1]);
  const lineTextY = useTransform(lineP, [0, 1], [40, 0]);

  useScrollProgress();

  return (
    <ReactLenis root options={{ lerp: 0.07, smoothWheel: true }}>
    <div className="min-h-screen bg-background overflow-x-hidden" style={{ scrollSnapType: "y proximity" }}>
      <Navigation />

      {/* ═══ HERO — Stays sticky while Section B scrolls over it ═══ */}
      <div ref={heroWrapRef} className="relative h-screen">
        <div className="sticky top-0 h-screen z-10 overflow-hidden">
          <motion.div
            className="h-full"
            style={{
              opacity: heroOpacity,
            }}
          >
            <Hero />
          </motion.div>
          {/* Canvas-based version - single element instead of 2000 divs */}
          <ParallaxPixelsCanvas scrollProgress={heroP} />
        </div>
      </div>

      {/* ═══ SECTION B — Horizontal scroll services ═══ */}
      <div id="services">
        <HorizontalServices />
      </div>

      {/* ═══ SPACER — Breathing room before The Line ═══ */}
      <div className="h-[30vh] bg-background" />

      {/* ═══ THE LINE — Smooth color inversion on center ═══ */}
      <motion.section
        ref={lineRef}
        className="relative z-20 min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: isDark ? "#000000" : "#FAFAFA",
          transition: "background-color 1s ease-in-out",
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.p
            className="text-2xl md:text-4xl font-light text-architectural max-w-3xl mx-auto"
            style={{
              color: isDark ? "#FAFAFA" : "#000000",
              transition: "color 1s ease-in-out",
              filter: lineTextFilter,
              opacity: lineTextOpacity,
              y: lineTextY,
            }}
          >
            We don't sell decks. We ship systems.
          </motion.p>
        </div>
      </motion.section>

      {/* ═══ HOW WE BUILD ═══ */}
      <div id="process">
        <HorizontalMethodology />
      </div>

      {/* ═══ FOOTER CTA ═══ */}
      <div id="contact" className="relative z-20">
        <FooterCTA />
      </div>
    </div>
    </ReactLenis>
  );
};

export default Index;
