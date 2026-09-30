import { useEffect, useState } from "react";

const CX = 100;
const CY = 96;
const R = 78;

function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

/** value: 0..1. Needle sweeps from 180deg (left) to 0deg (right) across three risk bands. */
export default function RiskGauge({ value }) {
  const [animated, setAnimated] = useState(0);
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduceMotion) {
      setAnimated(value);
      return;
    }
    const start = performance.now();
    const from = animated;
    const duration = 800;
    let frame;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const needleAngle = 180 - Math.max(0, Math.min(1, animated)) * 180;
  const needleTip = polar(CX, CY, R - 14, needleAngle);

  return (
    <svg viewBox="0 0 200 118" width="220" height="130" role="img" aria-label={`Risk gauge at ${Math.round(value * 100)} percent`}>
      <path d={arcPath(CX, CY, R, 180, 120)} stroke="var(--teal)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d={arcPath(CX, CY, R, 120, 60)} stroke="var(--saffron)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d={arcPath(CX, CY, R, 60, 0)} stroke="var(--rose)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <line
        x1={CX}
        y1={CY}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r="7" fill="var(--ink)" />
      <text x="14" y={CY + 16} fontSize="10" fill="var(--slate)" fontFamily="var(--font-mono)">
        Low
      </text>
      <text x="177" y={CY + 16} fontSize="10" fill="var(--slate)" fontFamily="var(--font-mono)" textAnchor="end">
        High
      </text>
    </svg>
  );
}
