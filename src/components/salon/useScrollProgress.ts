import { useEffect, useState } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState({ global: 0, camera: 0 });

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const maxGlobal = h.scrollHeight - h.clientHeight;
      const global = maxGlobal > 0 ? h.scrollTop / maxGlobal : 0;

      // Calculate camera scroll progress specifically within the tour section
      const tourElement = document.getElementById("tour");
      let camera = 0;
      if (tourElement) {
        const rect = tourElement.getBoundingClientRect();
        const tourHeight = rect.height;
        const windowHeight = window.innerHeight;
        const currentScroll = -rect.top;
        const maxScroll = tourHeight - windowHeight;
        if (maxScroll > 0) {
          const progressVal = currentScroll / maxScroll;
          camera = Math.min(1, Math.max(0, progressVal));
        }
      }

      setProgress({ global, camera });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
