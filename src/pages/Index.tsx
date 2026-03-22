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

  /* ── Transition: "The Line" section fades/blurs into focus ── */
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: lineP } = useScroll({
    target: lineRef,
    offset: ["start end", "start 0.6"],
  });
  const lineBlur = useTransform(lineP, [0, 0.6], [10, 0]);
  const lineOpacity = useTransform(lineP, [0, 0.5], [0, 1]);
  const lineScale = useTransform(lineP, [0, 1], [1.03, 1]);



  useScrollProgress();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
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

      {/* ═══ PROOF BAR ═══ */}
      <motion.section
        className="relative z-20 bg-background py-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="w-full h-px bg-border mb-16"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
            />
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { number: "40+", label: "Ventures backed" },
                { number: "8+", label: "Industries served" },
                { number: "3", label: "Continents" },
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-4xl md:text-5xl font-light text-architectural mb-2">{metric.number}</p>
                  <p className="text-minimal text-muted-foreground">{metric.label}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="w-full h-px bg-border mt-16"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "right" }}
            />
          </div>
        </div>
      </motion.section>

      {/* ═══ THE LINE — blurs into sharp focus (faster) ═══ */}
      <motion.section
        ref={lineRef}
        className="relative z-20 py-32 bg-background"
        style={{
          opacity: lineOpacity,
          scale: lineScale,
          filter: useTransform(lineBlur, (v) => `blur(${v}px)`),
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl md:text-3xl font-light text-architectural max-w-3xl mx-auto">
            We don't sell decks. We ship systems.
          </p>
        </div>
      </motion.section>

      {/* ═══ WORK PREVIEW ═══ */}
      <motion.section
        className="relative z-20 bg-background"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto py-32">
            <motion.h2
              className="text-4xl md:text-6xl font-light text-architectural mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Built. Running. Delivering.
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="border-t border-border pt-8">
                  <p className="text-minimal text-muted-foreground mb-4">FINANCIAL EDUCATION</p>
                  <p className="text-lg mb-2">AI guidance platform that scales two advisors' expertise to thousands of subscribers.</p>
                  <p className="text-muted-foreground">Recurring revenue product. Zero calendar impact on the founding team.</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="border-t border-border pt-8">
                  <p className="text-minimal text-muted-foreground mb-4">LEAD GENERATION</p>
                  <p className="text-lg mb-2">Automated prospecting pipeline that classifies, enriches, and routes contractor leads across an entire state.</p>
                  <p className="text-muted-foreground">Hundreds of qualified leads processed weekly without a single manual lookup.</p>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/work" className="text-foreground hover:text-muted-foreground transition-colors duration-300">
                See all work →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══ FOOTER CTA ═══ */}
      <div className="relative z-20">
        <FooterCTA />
      </div>
    </div>
  );
};

export default Index;
