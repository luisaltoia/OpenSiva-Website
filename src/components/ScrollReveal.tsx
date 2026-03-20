import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
  blur?: boolean;
}

const ScrollReveal = ({ children, className = "", direction = "up", delay = 0, blur = true }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.4 1"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? [60, 0] : [0, 0]
  );
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? [-60, 0] : direction === "right" ? [60, 0] : [0, 0]
  );
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const filterBlur = useTransform(scrollYProgress, [0, 1], blur ? [4, 0] : [0, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        x,
        opacity,
        filter: useTransform(filterBlur, (v) => `blur(${v}px)`),
        willChange: "transform, opacity, filter",
      }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
