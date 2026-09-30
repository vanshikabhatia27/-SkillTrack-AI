import { useEffect, useState } from "react";
import AnimatedNumber from "./AnimatedNumber.jsx";

export function StatCard({ label, value }) {
  const numeric = typeof value === "number" ? value : null;
  return (
    <div className="stat-card">
      <span className="stat-card__value">
        {numeric !== null ? <AnimatedNumber value={numeric} /> : value}
      </span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

export function RateBar({ label, value, warnBelow = 0.5, invert = false }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (value === null || value === undefined) return null;
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const isWarn = invert ? value > 1 - warnBelow : value < warnBelow;
  return (
    <div className="rate-row">
      <div className="rate-row__top">
        <span className="rate-row__name">{label}</span>
        <span className="rate-row__value">{pct.toFixed(1)}%</span>
      </div>
      <div className="rate-track">
        <div className={`rate-fill${isWarn ? " is-warn" : ""}`} style={{ width: ready ? `${pct}%` : 0 }} />
      </div>
    </div>
  );
}

export function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-IN").format(value);
}
