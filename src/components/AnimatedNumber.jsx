import { useEffect, useRef, useState } from "react";

/** Animates from 0 to `value` once, whenever `value` changes. Motion answers the data arriving. */
export default function AnimatedNumber({ value, format, duration = 700 }) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);
  const reduceMotion = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      setDisplay(0);
      return;
    }
    if (reduceMotion.current) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  const formatted = format ? format(display) : Math.round(display).toLocaleString("en-IN");
  return <>{formatted}</>;
}
