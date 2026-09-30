import { useEffect, useState } from "react";
import { MEASURE_LABELS } from "../lib/constants.js";
import { formatNumber } from "./Primitives.jsx";

const STAGE_KEYS = Object.keys(MEASURE_LABELS);
const SEGMENT_COLORS = ["#16213d", "#1e3554", "#1f7a6c", "#d99a2b"];

export default function FunnelChart({ counts }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [counts]);

  const max = counts[STAGE_KEYS[0]] || 1;
  const widths = STAGE_KEYS.map((k) => Math.max(10, ((counts[k] || 0) / max) * 100));

  return (
    <div className="funnel">
      {STAGE_KEYS.slice(0, -1).map((key, i) => {
        const topPct = widths[i];
        const bottomPct = widths[i + 1];
        const topInset = (100 - topPct) / 2;
        const bottomInset = (100 - bottomPct) / 2;
        const prevCount = counts[STAGE_KEYS[i]] || 0;
        const nextCount = counts[STAGE_KEYS[i + 1]] || 0;
        const conversion = prevCount > 0 ? (nextCount / prevCount) * 100 : null;

        return (
          <div className="funnel__row" key={key}>
            <div
              className="funnel__segment"
              style={{
                clipPath: ready
                  ? `polygon(${topInset}% 0, ${100 - topInset}% 0, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`
                  : "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
                background: SEGMENT_COLORS[i],
              }}
            />
            <div className="funnel__label">
              <span className="funnel__label-stage">{MEASURE_LABELS[key]}</span>
              <span className="funnel__label-count">{formatNumber(counts[key])}</span>
              {conversion !== null && (
                <span className="funnel__label-conv">
                  {i === 0 ? "start" : `${conversion.toFixed(1)}% converted from ${MEASURE_LABELS[STAGE_KEYS[i]]}`}
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div className="funnel__row funnel__row--final">
        <div
          className="funnel__segment"
          style={{
            clipPath: ready
              ? `polygon(${(100 - widths.at(-1)) / 2}% 0, ${100 - (100 - widths.at(-1)) / 2}% 0, ${
                  100 - (100 - widths.at(-1) * 0.88) / 2
                }% 100%, ${(100 - widths.at(-1) * 0.88) / 2}% 100%)`
              : "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            background: SEGMENT_COLORS[3],
          }}
        />
        <div className="funnel__label">
          <span className="funnel__label-stage">{MEASURE_LABELS[STAGE_KEYS.at(-1)]}</span>
          <span className="funnel__label-count">{formatNumber(counts[STAGE_KEYS.at(-1)])}</span>
          <span className="funnel__label-conv">final reported outcome</span>
        </div>
      </div>
    </div>
  );
}
