import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FooterCTA from "@/components/FooterCTA";
import ParallaxPixels from "@/components/ParallaxPixels";
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

  /* ── Transition: "The Line" section blurs into focus ── */
  const lineRef = useRef<HTMLElement>(null);
  const { scrollYProgress: lineP } = useScroll({
    target: lineRef,
    offset: ["start 90%", "center center"],
  });
  const lineTextBlur = useTransform(lineP, [0, 0.65, 1], [18, 6, 0]);
  const lineTextFilter = useTransform(lineTextBlur, (v) => `blur(${v}px)`);
  const lineTextOpacity = useTransform(lineP, [0, 0.2, 0.45], [0.5, 0.85, 1]);
  const lineTextY = useTransform(lineP, [0, 1], [18, 0]);
  const lineScale = useTransform(lineP, [0, 1], [1.02, 1]);



  useScrollProgress();

  return (
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
          <ParallaxPixels scrollProgress={heroP} />
        </div>
      </div>

      {/* ═══ SECTION B — Horizontal scroll services ═══ */}
      <section className="relative z-40 bg-background">
        <HorizontalServices />
      </section>




      {/* ═══ THE LINE — blurs into sharp focus (faster) ═══ */}
      <motion.section
        ref={lineRef}
        className="relative z-20 min-h-screen flex items-center justify-center bg-background"
        style={{
          scale: lineScale,
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.p
            className="text-2xl md:text-3xl font-light text-architectural max-w-3xl mx-auto"
            style={{
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
      <HorizontalMethodology />

      {/* ═══ FOOTER CTA ═══ */}
      <div className="relative z-20">
        <FooterCTA />
      </div>
    </div>
  );
};

export default Index;
