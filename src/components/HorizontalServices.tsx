import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
const GAP = 30;

const HorizontalServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalDistance = (services.length - 1) * (ITEM_WIDTH + GAP);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${(services.length + 1) * 100}vh` }}
    >
      {/* Title — fades out as cards appear */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-10">
        <motion.h2
          className="text-4xl md:text-6xl font-light text-architectural text-center px-6"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
            scale: useTransform(scrollYProgress, [0, 0.15], [1, 0.95]),
          }}
        >
          Three ways to stop being the bottleneck.
        </motion.h2>
      </div>

      {/* Cards — sticky horizontal gallery */}
      <div
        className="sticky top-0 h-screen flex items-center overflow-hidden"
        style={{ marginTop: "-100vh" }}
      >
        <motion.div
          className="flex"
          style={{
            x,
            gap: GAP,
            paddingLeft: "calc(50vw - 250px)", // center first card
            opacity: useTransform(scrollYProgress, [0.08, 0.2], [0, 1]),
          }}
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="flex-shrink-0 rounded-2xl border border-border bg-background relative overflow-hidden"
              style={{ width: ITEM_WIDTH, height: "65vh", minHeight: 450 }}
            >
              {/* Content positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <span className="inline-block bg-foreground text-background text-[10px] tracking-widest uppercase font-medium px-4 py-1.5 rounded-full mb-4">
                  0{service.id}
                </span>
                <h3 className="text-2xl md:text-3xl font-light text-architectural mb-3">
                  {service.label}
                </h3>
                <p className="text-lg font-light text-architectural mb-3">
                  {service.headline}
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {service.body}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HorizontalServices;
