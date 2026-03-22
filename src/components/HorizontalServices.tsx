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
  const x = useTransform(scrollYProgress, [0.25, 0.9], [0, -totalDistance]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${(services.length + 2) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Title — visible first, fades as cards come in */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <motion.h2
            className="text-4xl md:text-6xl font-light text-architectural text-center px-6"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.18], [1, 0]),
              scale: useTransform(scrollYProgress, [0, 0.18], [1, 0.95]),
            }}
          >
            Three ways to stop being the bottleneck.
          </motion.h2>
        </div>

        {/* Cards gallery */}
        <div className="absolute inset-0 flex items-center">
          <motion.div
            className="flex"
            style={{
              x,
              gap: GAP,
              paddingLeft: "calc(50vw - 250px)",
              opacity: useTransform(scrollYProgress, [0.1, 0.25], [0, 1]),
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 rounded-2xl overflow-hidden"
                style={{
                  width: ITEM_WIDTH,
                  height: "70vh",
                  minHeight: 450,
                  backgroundColor: "hsl(0 0% 5%)",
                }}
              >
                <div className="relative h-full flex flex-col justify-end p-8 md:p-10">
                  <span className="inline-block text-white/50 text-xs tracking-widest uppercase font-medium mb-4">
                    0{service.id}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-light text-white mb-3">
                    {service.label}
                  </h3>
                  <p className="text-lg font-light text-white/80 mb-3">
                    {service.headline}
                  </p>
                  <p className="text-white/50 leading-relaxed text-sm">
                    {service.body}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalServices;
