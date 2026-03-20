import { useEffect } from "react";

/**
 * Sets a --scroll CSS custom property on document.body (0 → 1)
 * so any element can use it for scroll-linked CSS animations.
 */
const useScrollProgress = () => {
  useEffect(() => {
    const update = () => {
      const position =
        window.scrollY /
        (document.body.scrollHeight - window.innerHeight || 1);
      document.body.style.setProperty("--scroll", String(position));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
};

export default useScrollProgress;
