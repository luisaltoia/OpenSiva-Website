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
const SECTION_SCREENS = 6;

const HorizontalServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalDistance = (services.length - 1) * (ITEM_WIDTH + GAP);

  // Keep horizontal movement active for almost the whole sticky duration
  const x = useTransform(scrollYProgress, [0.08, 0.92], [0, -totalDistance]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.14], [1, 0.96]);
  const cardsOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative bg-background"
      style={{ height: `${SECTION_SCREENS * 100}vh` }}
    >
      {/* Locked viewport: page scroll drives horizontal cards */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{ opacity: titleOpacity, scale: titleScale }}
        >
          <h2 className="text-4xl md:text-6xl font-light text-architectural text-center">
            Three ways to stop being the bottleneck.
          </h2>
        </motion.div>

        <motion.div className="absolute inset-0 flex items-center" style={{ opacity: cardsOpacity }}>
          <motion.div
            className="flex"
            style={{
              x,
              gap: GAP,
              paddingLeft: "calc(50vw - 250px)",
              paddingRight: "calc(50vw - 250px)",
            }}
          >
            {services.map((service) => (
              <article
                key={service.id}
                className="flex-shrink-0 h-[70vh] min-h-[450px] rounded-2xl bg-foreground text-background border border-background/10 overflow-hidden"
                style={{ width: ITEM_WIDTH }}
              >
                <div className="h-full flex flex-col justify-end p-8 md:p-10">
                  <span className="inline-block text-background/60 text-xs tracking-widest uppercase font-medium mb-4">
                    0{service.id}
                  </span>

                  <h3 className="text-3xl md:text-4xl font-light text-architectural mb-3 text-background">
                    {service.label}
                  </h3>

                  <p className="text-lg font-light text-background/85 mb-3">
                    {service.headline}
                  </p>

                  <p className="text-background/60 leading-relaxed text-sm">
                    {service.body}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HorizontalServices;
