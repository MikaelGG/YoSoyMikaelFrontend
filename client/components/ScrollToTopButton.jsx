import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className="fixed bottom-8 right-8 z-50 group flex items-center gap-2.5 px-5 py-3 rounded-full bg-neutral-950/85 hover:bg-neutral-900/95 border border-cyan-400/40 hover:border-cyan-300 shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_40px_rgba(0,229,255,0.55)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white animate-in fade-in zoom-in-90"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 group-hover:bg-cyan-400 group-hover:text-brand-ink transition-all">
        <svg
          className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200 group-hover:text-white transition-colors">
        Subir
      </span>
    </button>
  );
}
