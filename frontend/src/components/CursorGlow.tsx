import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices — no cursor to follow
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      // Smooth follow with easing
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      el.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[500px] rounded-full opacity-60 mix-blend-screen blur-3xl"
      style={{
        background:
          "radial-gradient(circle, hsl(270 95% 65% / 0.25), hsl(220 90% 60% / 0.12) 40%, transparent 70%)",
      }}
    />
  );
}
