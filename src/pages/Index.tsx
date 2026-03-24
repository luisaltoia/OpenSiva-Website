import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FooterCTA from "@/components/FooterCTA";
import ParallaxPixels from "@/components/ParallaxPixels";
import HorizontalServices from "@/components/HorizontalServices";
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
      <section className="relative z-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto py-32">
            <motion.h2
              className="text-4xl md:text-6xl font-light text-architectural mb-24"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              How we build.
            </motion.h2>

            <div className="space-y-32">
              {[
                { num: 1, name: "Map", body: "We study how your business actually runs. Not the org chart — the real workflows. Who makes which decisions, where the bottlenecks are, what's manual that shouldn't be, and where expertise is stuck in one person's head. Every engagement starts here." },
                { num: 2, name: "Diagnose", body: "We identify which processes have the highest ROI if automated, which knowledge should become a product, and which decisions can be handled by an agent. Not everything needs AI. We find the areas where it pays for itself." },
                { num: 3, name: "Architect", body: "We design the system. Data flows, integration points, decision logic, and how the AI fits into your existing operations — not beside them. Every solution is scoped against a clear return before a single line of code is written." },
                { num: 4, name: "Build", body: "We develop the AI products, agents, or automation end to end. No handoffs to third parties. No templates. Custom infrastructure built to your operations, your data, and your rules." },
                { num: 5, name: "Deploy & Operate", body: "We launch the system into your live environment and operate it. Monitoring, maintenance, and performance tracking against the ROI targets set in the diagnostic. We don't hand over a login and disappear." },
                { num: 6, name: "Scale", body: "Once the first systems prove their return, we expand. More processes. More automation. Higher AI maturity across the business. Each phase is driven by results from the last — not a roadmap written before we learned anything." },
              ].map((stage) => (
                <motion.div
                  key={stage.num}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="border-t border-border pt-8">
                    <p className="text-minimal text-muted-foreground mb-6">
                      STAGE {stage.num}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-light text-architectural mb-4">
                      {stage.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-[680px]">
                      {stage.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER CTA ═══ */}
      <div className="relative z-20">
        <FooterCTA />
      </div>
    </div>
  );
};

export default Index;
