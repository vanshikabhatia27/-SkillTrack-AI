import { useEffect, useState } from "react";
import { analyzeEmployment } from "../lib/api.js";
import { EMPLOYMENT_GROUPINGS, EMPLOYMENT_FILTER_VALUES, MEASURE_LABELS, RATE_LABELS } from "../lib/constants.js";
import { StatCard, RateBar, formatNumber } from "./Primitives.jsx";
import { SkeletonStatRow, SkeletonBlock } from "./Skeleton.jsx";
import FunnelChart from "./FunnelChart.jsx";
import { IconFunnel, IconSpinner } from "./icons.jsx";

export default function EmploymentPanel() {
  const [grouping, setGrouping] = useState("none");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnomalies, setShowAnomalies] = useState(false);

  const activeGrouping = EMPLOYMENT_GROUPINGS.find((g) => g.key === grouping);
  const valueOptions = activeGrouping?.filterField ? EMPLOYMENT_FILTER_VALUES[activeGrouping.filterField] : null;

  function runQuery(field, val) {
    setLoading(true);
    setError(null);
    const filters = field && val ? { [field]: val } : null;
    analyzeEmployment(filters)
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    runQuery(null, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGroupingChange(key) {
    setGrouping(key);
    const g = EMPLOYMENT_GROUPINGS.find((item) => item.key === key);
    if (!g.filterField) {
      setValue("");
      runQuery(null, null);
      return;
    }
    const first = EMPLOYMENT_FILTER_VALUES[g.filterField][0];
    setValue(first);
    runQuery(g.filterField, first);
  }

  function handleValueChange(val) {
    setValue(val);
    runQuery(activeGrouping.filterField, val);
  }

  const rates = result?.rates || {};
  const counts = result?.counts || {};
  const records = result?.records || [];
  const anomalies = result?.anomalies || [];

  return (
    <>
      <div className="page-head">
        <span className="page-head__icon">
          <IconFunnel width="20" height="20" />
        </span>
        <div>
          <h1>Employment outcomes</h1>
          <p>
            Training-to-placement funnel drawn from the PMKVY skilling dataset — enrolment through to reported
            placement, with data-quality anomalies flagged separately.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="section-title">Break down by</div>
        <div className="form-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          <div className="field">
            <label htmlFor="grouping">Grouping</label>
            <select id="grouping" value={grouping} onChange={(e) => handleGroupingChange(e.target.value)}>
              {EMPLOYMENT_GROUPINGS.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          {valueOptions && (
            <div className="field">
              <label htmlFor="value">{activeGrouping.label.replace("By ", "")}</label>
              <select id="value" value={value} onChange={(e) => handleValueChange(e.target.value)}>
                {valueOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          )}
          {loading && result && (
            <div className="field" style={{ justifyContent: "flex-end" }}>
              <span style={{ height: 20 }} />
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--slate)", fontSize: 12.5 }}>
                <IconSpinner /> updating…
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="callout callout--error" style={{ marginTop: 20 }}>
          {error}
        </div>
      )}

      {!result && loading && (
        <div style={{ marginTop: 20 }}>
          <SkeletonStatRow />
          <div className="panel">
            <SkeletonBlock height={220} />
          </div>
        </div>
      )}

      {result && !error && (
        <div className="reveal">
          <div className="stat-row" style={{ marginTop: 20 }}>
            {Object.entries(MEASURE_LABELS).map(([key, label]) => (
              <StatCard key={key} label={label} value={counts[key] ?? 0} />
            ))}
          </div>

          <div className="panel">
            <div className="section-title">Training-to-placement funnel</div>
            <FunnelChart counts={counts} />
          </div>

          <div className="panel">
            <div className="section-title">Pipeline rates</div>
            <div className="rate-list">
              {Object.entries(RATE_LABELS).map(([key, label]) => (
                <RateBar
                  key={key}
                  label={label}
                  value={rates[key]}
                  invert={key === "pipeline_dropoff_rate"}
                />
              ))}
              {Object.values(rates).every((v) => v === null || v === undefined) && (
                <p className="empty-note">No rate data available for this selection.</p>
              )}
            </div>
          </div>

          {records.length > 1 && (
            <div className="panel">
              <div className="section-title">Breakdown ({records.length} rows)</div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{result.summary_group}</th>
                      {Object.keys(MEASURE_LABELS).map((m) => (
                        <th key={m}>{MEASURE_LABELS[m]}</th>
                      ))}
                      <th>Placement rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row, i) => {
                      const nameKey = Object.keys(row).find((k) =>
                        ["TCState", "Scheme", "Component", "TrainingType"].includes(k)
                      );
                      return (
                        <tr key={i}>
                          <td>{row[nameKey]}</td>
                          {Object.keys(MEASURE_LABELS).map((m) => (
                            <td key={m}>{formatNumber(row[m])}</td>
                          ))}
                          <td>{row.placement_rate != null ? `${(row.placement_rate * 100).toFixed(1)}%` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="panel">
            <div className="section-title">Data quality</div>
            <p className="empty-note" style={{ marginBottom: anomalies.length ? 12 : 0 }}>
              {anomalies.length
                ? `${anomalies.length} anomaly row${anomalies.length === 1 ? "" : "s"} flagged for this selection.`
                : "No anomalies flagged for this selection."}
            </p>
            {anomalies.length > 0 && (
              <>
                <button type="button" className="btn btn--ghost" onClick={() => setShowAnomalies((s) => !s)}>
                  {showAnomalies ? "Hide anomaly rows" : "Show anomaly rows"}
                </button>
                {showAnomalies && (
                  <div className="table-scroll" style={{ marginTop: 14 }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          {Object.keys(anomalies[0]).map((k) => (
                            <th key={k}>{k}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {anomalies.slice(0, 50).map((row, i) => (
                          <tr key={i}>
                            {Object.keys(anomalies[0]).map((k) => (
                              <td key={k}>{String(row[k] ?? "—")}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
