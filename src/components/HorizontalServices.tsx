import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Cpu, Bot, Workflow } from "lucide-react";

const services = [
  {
    id: 1,
    label: "AI SYSTEMS",
    headline: "Your expertise becomes a product.",
    body: "We build AI platforms that take what your team knows and deliver it at scale. Your knowledge becomes a subscription product that works around the clock.",
    icon: Cpu,
  },
  {
    id: 2,
    label: "AGENTS",
    headline: "Systems that act, not just answer.",
    body: "We build AI agents that execute workflows, route decisions, and operate within your rules. Not chatbots. Operating systems for your business.",
    icon: Bot,
  },
  {
    id: 3,
    label: "AUTOMATION",
    headline: "Remove the manual. Keep the control.",
    body: "We automate business processes end to end. Data pipelines, approval workflows, reporting, integrations. What used to take a team now runs on infrastructure.",
    icon: Workflow,
  },
];

const CARD_WIDTH = 520;
const CARD_GAP = 40;

const ServiceCard = ({
  service,
  scrollProgress,
  index,
}: {
  service: (typeof services)[0];
  scrollProgress: any;
  index: number;
}) => {
  const Icon = service.icon;
  
  const totalCards = services.length;
  const startActivation = index / totalCards;
  const endActivation = (index + 1) / totalCards;
  
  const scale = useTransform(
    scrollProgress,
    [startActivation - 0.1, startActivation, endActivation, endActivation + 0.1],
    [0.85, 1, 1, 0.85]
  );
  
  const opacity = useTransform(
    scrollProgress,
    [startActivation - 0.1, startActivation, endActivation, endActivation + 0.1],
    [0.4, 1, 1, 0.4]
  );

  return (
    <motion.article
      className="flex-shrink-0 rounded-2xl border border-background/10 bg-foreground text-background overflow-hidden"
      style={{
        width: CARD_WIDTH,
        height: "50vh",
        minHeight: "320px",
        maxHeight: "420px",
        scale,
        opacity,
      }}
    >
      <div className="h-full flex flex-col overflow-hidden p-6 md:p-8">
        <div className="pb-0">
          <Icon
            className="text-background drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            size={32}
            strokeWidth={1.5}
          />
        </div>
        <div className="mt-auto pt-0">
          <span className="inline-block text-background/60 text-xs tracking-widest uppercase font-medium mb-3">
            0{service.id}
          </span>
          <h3 className="font-light text-architectural text-background text-2xl md:text-3xl mb-2">
            {service.label}
          </h3>
          <p className="text-base font-light text-background/85 mb-2">
            {service.headline}
          </p>
          <p className="text-background/60 leading-relaxed text-sm">
            {service.body}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

const HorizontalServices = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  
  const totalDistance = (services.length - 1) * (CARD_WIDTH + CARD_GAP);
  const x = useTransform(scrollYProgress, [0.2, 1], [0, -totalDistance]);

  return (
    <section
      ref={containerRef}
      className="relative bg-background"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-background flex items-center justify-center">
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none z-10"
          style={{ opacity: titleOpacity, scale: titleScale }}
        >
          <h2 className="text-4xl md:text-6xl font-light text-architectural text-center text-foreground">
            Three ways to stop being the bottleneck.
          </h2>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: cardsOpacity }}
        >
          <div className="relative w-full max-w-7xl overflow-visible">
            <motion.div
              className="flex items-center"
              style={{ 
                x,
                gap: CARD_GAP,
                paddingLeft: `calc(50vw - ${CARD_WIDTH / 2}px)`,
                paddingRight: `calc(50vw - ${CARD_WIDTH / 2}px)`,
              }}
            >
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  scrollProgress={scrollYProgress}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalServices;
