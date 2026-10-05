import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";

/** Decorative animation never gates rendering or intercepts an action. */
export default function PageMotion() {
  const container = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const root = container.current;
    if (!root || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;
    const seen = new WeakSet<Element>();
    const stop = () => {
      observer?.disconnect();
      mutations?.disconnect();
      root.querySelectorAll(".motion-arriving").forEach(el => el.classList.remove("motion-arriving"));
    };
    const start = () => {
      stop();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer?.unobserve(entry.target);
          entry.target.classList.add("motion-arriving");
        });
      }, { threshold: 0.08 });
      const scan = () => {
        root.querySelectorAll<HTMLElement>("[data-reveal]").forEach(el => {
          if (seen.has(el)) return;
          seen.add(el);
          const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
          el.style.setProperty("--arrival-delay", `${Math.min(index, 4) * 55}ms`);
          observer?.observe(el);
        });
      };
      scan();
      mutations = new MutationObserver(scan);
      mutations.observe(root, { childList: true, subtree: true });
    };
    start();
    preference.addEventListener("change", start);
    return () => { stop(); preference.removeEventListener("change", start); };
  }, [pathname]);

  return <div ref={container} className="page-motion" key={pathname} onAnimationEnd={event => { if (event.animationName === "pieceArrival") (event.target as HTMLElement).classList.remove("motion-arriving"); }}><Outlet /></div>;
}
