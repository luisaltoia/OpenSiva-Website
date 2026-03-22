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
const GAP = 32;
const LOCK_HEIGHT_SCREENS = 8;

const HorizontalServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalDistance = (services.length - 1) * (ITEM_WIDTH + GAP);

  // Title is centered immediately when section starts, then fades quickly.
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.16], [1, 1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.16], [1, 0.96]);

  // Cards pop up right after the title phase.
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.18], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.1, 0.18], [80, 0]);

  // Horizontal movement starts early and runs through almost all locked scroll.
  const x = useTransform(scrollYProgress, [0.16, 0.94], [0, -totalDistance]);

  return (
    <section
      ref={containerRef}
      className="relative bg-background"
      style={{ height: `${LOCK_HEIGHT_SCREENS * 100}vh` }}
    >
      {/* This sticky layer is the "screen lock" behavior from the reference */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{ opacity: titleOpacity, scale: titleScale }}
        >
          <h2 className="text-4xl md:text-6xl font-light text-architectural text-center">
            Three ways to stop being the bottleneck.
          </h2>
        </motion.div>

        <motion.div className="absolute inset-0 flex items-center" style={{ opacity: cardsOpacity, y: cardsY }}>
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
                className="flex-shrink-0 h-[70vh] min-h-[460px] rounded-2xl bg-foreground text-background border border-background/10 overflow-hidden"
                style={{ width: ITEM_WIDTH }}
              >
                <div className="h-full flex flex-col justify-end p-8 md:p-10">
                  <span className="inline-block text-background/60 text-xs tracking-widest uppercase font-medium mb-4">
                    0{service.id}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-light text-architectural mb-3 text-background">
                    {service.label}
                  </h3>
                  <p className="text-lg font-light text-background/85 mb-3">{service.headline}</p>
                  <p className="text-background/60 leading-relaxed text-sm">{service.body}</p>
                </div>
              </article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalServices;
