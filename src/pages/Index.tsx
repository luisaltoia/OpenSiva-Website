import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FooterCTA from "@/components/FooterCTA";

const Index = () => {
  // Refs for each section to track scroll
  const sectionBRef = useRef<HTMLDivElement>(null);
  const sectionCRef = useRef<HTMLDivElement>(null);
  const sectionDRef = useRef<HTMLDivElement>(null);
  const sectionERef = useRef<HTMLDivElement>(null);
  const sectionFRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Hero fades/blurs out as you scroll away
  const { scrollYProgress: heroExit } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBlur = useTransform(heroExit, [0.5, 1], [0, 12]);
  const heroOpacity = useTransform(heroExit, [0.5, 1], [1, 0]);
  const heroScale = useTransform(heroExit, [0.5, 1], [1, 0.95]);

  // Section B slides up over hero
  const { scrollYProgress: sectionBProgress } = useScroll({
    target: sectionBRef,
    offset: ["start end", "start 0.3"],
  });
  const sectionBY = useTransform(sectionBProgress, [0, 1], [120, 0]);
  const sectionBOpacity = useTransform(sectionBProgress, [0, 0.5], [0, 1]);

  // Section C — proof bar
  const { scrollYProgress: sectionCProgress } = useScroll({
    target: sectionCRef,
    offset: ["start end", "start 0.4"],
  });
  const sectionCScale = useTransform(sectionCProgress, [0, 1], [0.92, 1]);
  const sectionCOpacity = useTransform(sectionCProgress, [0, 0.6], [0, 1]);

  // Section D — the line
  const { scrollYProgress: sectionDProgress } = useScroll({
    target: sectionDRef,
    offset: ["start end", "start 0.4"],
  });
  const sectionDBlur = useTransform(sectionDProgress, [0, 0.8], [8, 0]);
  const sectionDOpacity = useTransform(sectionDProgress, [0, 0.8], [0, 1]);

  // Section E — work preview
  const { scrollYProgress: sectionEProgress } = useScroll({
    target: sectionERef,
    offset: ["start end", "start 0.3"],
  });
  const sectionEY = useTransform(sectionEProgress, [0, 1], [80, 0]);
  const sectionEOpacity = useTransform(sectionEProgress, [0, 0.5], [0, 1]);

  // Section F — footer CTA
  const { scrollYProgress: sectionFProgress } = useScroll({
    target: sectionFRef,
    offset: ["start end", "start 0.5"],
  });
  const sectionFScale = useTransform(sectionFProgress, [0, 1], [0.9, 1]);
  const sectionFOpacity = useTransform(sectionFProgress, [0, 0.6], [0, 1]);
  const sectionFBlur = useTransform(sectionFProgress, [0, 0.6], [6, 0]);

  // Individual card animations for Section B
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress: c1 } = useScroll({ target: card1Ref, offset: ["start end", "start 0.5"] });
  const { scrollYProgress: c2 } = useScroll({ target: card2Ref, offset: ["start end", "start 0.5"] });
  const { scrollYProgress: c3 } = useScroll({ target: card3Ref, offset: ["start end", "start 0.5"] });

  const c1Y = useTransform(c1, [0, 1], [40, 0]);
  const c1O = useTransform(c1, [0, 0.6], [0, 1]);
  const c2Y = useTransform(c2, [0, 1], [40, 0]);
  const c2O = useTransform(c2, [0, 0.6], [0, 1]);
  const c3Y = useTransform(c3, [0, 1], [40, 0]);
  const c3O = useTransform(c3, [0, 0.6], [0, 1]);

  // Work preview cards
  const work1Ref = useRef<HTMLDivElement>(null);
  const work2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: w1 } = useScroll({ target: work1Ref, offset: ["start end", "start 0.4"] });
  const { scrollYProgress: w2 } = useScroll({ target: work2Ref, offset: ["start end", "start 0.4"] });
  const w1X = useTransform(w1, [0, 1], [-60, 0]);
  const w1O = useTransform(w1, [0, 0.5], [0, 1]);
  const w2X = useTransform(w2, [0, 1], [60, 0]);
  const w2O = useTransform(w2, [0, 0.5], [0, 1]);

  // Proof bar metrics
  const m1Ref = useRef<HTMLDivElement>(null);
  const m2Ref = useRef<HTMLDivElement>(null);
  const m3Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: m1p } = useScroll({ target: m1Ref, offset: ["start end", "start 0.5"] });
  const { scrollYProgress: m2p } = useScroll({ target: m2Ref, offset: ["start end", "start 0.5"] });
  const { scrollYProgress: m3p } = useScroll({ target: m3Ref, offset: ["start end", "start 0.5"] });
  const m1Scale = useTransform(m1p, [0, 1], [0.7, 1]);
  const m1O = useTransform(m1p, [0, 0.6], [0, 1]);
  const m2Scale = useTransform(m2p, [0, 1], [0.7, 1]);
  const m2O = useTransform(m2p, [0, 0.6], [0, 1]);
  const m3Scale = useTransform(m3p, [0, 1], [0.7, 1]);
  const m3O = useTransform(m3p, [0, 0.6], [0, 1]);

  const blocks = [
    {
      label: "PRODUCTS",
      headline: "Your expertise becomes a product.",
      body: "We build AI platforms that take what your team knows and deliver it at scale. Your knowledge becomes a subscription product that works around the clock.",
    },
    {
      label: "AGENTS",
      headline: "Systems that act, not just answer.",
      body: "We build AI agents that execute workflows, route decisions, and operate within your rules. Not chatbots. Operating systems for your business.",
    },
    {
      label: "AUTOMATION",
      headline: "Remove the manual. Keep the control.",
      body: "We automate business processes end to end. Data pipelines, approval workflows, reporting, integrations. What used to take a team now runs on infrastructure.",
    },
  ];

  const cardRefs = [card1Ref, card2Ref, card3Ref];
  const cardYs = [c1Y, c2Y, c3Y];
  const cardOs = [c1O, c2O, c3O];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* Hero — sticky, blurs & scales down as you scroll past */}
      <div ref={heroRef} className="relative z-10">
        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            filter: useTransform(heroBlur, (v) => `blur(${v}px)`),
          }}
        >
          <Hero />
        </motion.div>
      </div>

      {/* Section B — slides up over hero with overlap */}
      <motion.section
        ref={sectionBRef}
        className="relative z-20 py-32 bg-background"
        style={{
          y: sectionBY,
          opacity: sectionBOpacity,
          boxShadow: "0 -40px 80px -20px hsl(0 0% 0% / 0.15)",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl md:text-6xl font-light text-architectural mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Three ways to stop being the bottleneck.
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-16">
              {blocks.map((block, i) => (
                <motion.div
                  key={i}
                  ref={cardRefs[i]}
                  style={{ y: cardYs[i], opacity: cardOs[i] }}
                >
                  <p className="text-minimal text-muted-foreground mb-4">{block.label}</p>
                  <h3 className="text-2xl font-light text-architectural mb-4">{block.headline}</h3>
                  <p className="text-muted-foreground leading-relaxed">{block.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section C — Proof Bar — scales in from small */}
      <motion.section
        ref={sectionCRef}
        className="relative z-30 py-20 bg-muted"
        style={{
          scale: sectionCScale,
          opacity: sectionCOpacity,
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
            {[
              { number: "40+", label: "Ventures backed" },
              { number: "8+", label: "Industries served" },
              { number: "3", label: "Continents" },
            ].map((metric, i) => {
              const refs = [m1Ref, m2Ref, m3Ref];
              const scales = [m1Scale, m2Scale, m3Scale];
              const opacities = [m1O, m2O, m3O];
              return (
                <motion.div
                  key={i}
                  ref={refs[i]}
                  style={{ scale: scales[i], opacity: opacities[i] }}
                >
                  <p className="text-4xl md:text-5xl font-light text-architectural mb-2">{metric.number}</p>
                  <p className="text-minimal text-muted-foreground">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Section D — The Line — blurs in from nothing */}
      <motion.section
        ref={sectionDRef}
        className="relative z-30 py-24 bg-background"
        style={{
          opacity: sectionDOpacity,
          filter: useTransform(sectionDBlur, (v) => `blur(${v}px)`),
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl md:text-3xl font-light text-architectural max-w-3xl mx-auto">
            We don't sell decks. We ship systems.
          </p>
        </div>
      </motion.section>

      {/* Section E — Work Preview — slides up with card stagger */}
      <motion.section
        ref={sectionERef}
        className="relative z-40 py-32 bg-muted"
        style={{
          y: sectionEY,
          opacity: sectionEOpacity,
          boxShadow: "0 -30px 60px -15px hsl(0 0% 0% / 0.1)",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
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
              <motion.div ref={work1Ref} style={{ x: w1X, opacity: w1O }}>
                <div className="border-t border-border pt-8">
                  <p className="text-minimal text-muted-foreground mb-4">FINANCIAL EDUCATION</p>
                  <p className="text-lg mb-2">AI guidance platform that scales two advisors' expertise to thousands of subscribers.</p>
                  <p className="text-muted-foreground">Recurring revenue product. Zero calendar impact on the founding team.</p>
                </div>
              </motion.div>
              <motion.div ref={work2Ref} style={{ x: w2X, opacity: w2O }}>
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
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/work" className="text-foreground hover:text-muted-foreground transition-colors duration-300">
                See all work →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section F — Footer CTA — scales & blurs in */}
      <motion.div
        ref={sectionFRef}
        className="relative z-50"
        style={{
          scale: sectionFScale,
          opacity: sectionFOpacity,
          filter: useTransform(sectionFBlur, (v) => `blur(${v}px)`),
        }}
      >
        <FooterCTA />
      </motion.div>
    </div>
  );
};

export default Index;
