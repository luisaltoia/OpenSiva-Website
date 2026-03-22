import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const services = [
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

const CARD_WIDTH = 420;
const CARD_GAP = 40;

const HorizontalServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalDistance = (services.length - 1) * (CARD_WIDTH + CARD_GAP);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <div ref={containerRef} className="relative" style={{ height: `${services.length * 100}vh` }}>
      {/* Sticky wrapper */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl md:text-6xl font-light text-architectural mb-16"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Three ways to stop being the bottleneck.
            </motion.h2>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto overflow-visible">
            <motion.div
              className="flex"
              style={{ x, gap: CARD_GAP }}
            >
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  className="flex-shrink-0 flex flex-col justify-between"
                  style={{ width: CARD_WIDTH }}
                >
                  <div>
                    <span className="inline-block bg-foreground text-background text-[10px] tracking-widest uppercase font-medium px-4 py-1.5 rounded-full mb-6">
                      {service.label}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-light text-architectural mb-5">
                      {service.headline}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {service.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalServices;
