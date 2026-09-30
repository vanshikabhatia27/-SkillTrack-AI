import { useState } from "react";
import { predictRetention } from "../lib/api.js";
import { RETENTION_FIELD_GROUPS, RETENTION_SAMPLE } from "../lib/constants.js";
import { IconShield, IconSpinner } from "./icons.jsx";
import RiskGauge from "./RiskGauge.jsx";

function buildInitialState() {
  const state = {};
  RETENTION_FIELD_GROUPS.forEach((group) => {
    group.fields.forEach((field) => {
      state[field.name] = field.type === "select" ? field.options[0] : "";
    });
  });
  return state;
}

export default function RetentionPanel() {
  const [form, setForm] = useState(buildInitialState);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function loadSample() {
    setForm(RETENTION_SAMPLE);
    setResult(null);
    setError(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {};
    RETENTION_FIELD_GROUPS.forEach((group) => {
      group.fields.forEach((field) => {
        const raw = form[field.name];
        payload[field.name] = field.type === "number" ? Number(raw) : raw;
      });
    });

    predictRetention(payload)
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  const riskClass = result ? `risk-${result.risk_level.toLowerCase()}` : "";

  return (
    <>
      <div className="page-head">
        <span className="page-head__icon">
          <IconShield width="20" height="20" />
        </span>
        <div>
          <h1>Retention risk</h1>
          <p>
            Enter an employee's profile to estimate attrition probability. The model was trained on IT-workforce
            attrition records and scores the full set of fields below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="panel">
          {RETENTION_FIELD_GROUPS.map((group) => (
            <div className="field-group" key={group.id}>
              <div className="section-title">{group.title}</div>
              <div className="form-grid">
                {group.fields.map((field) => (
                  <div className="field" key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        id={field.name}
                        value={form[field.name]}
                        onChange={(e) => updateField(field.name, e.target.value)}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.name}
                        type="number"
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder}
                        value={form[field.name]}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button type="submit" className="btn" disabled={loading}>
              <span className="btn__content">
                {loading && <IconSpinner />}
                {loading ? "Scoring…" : "Predict risk"}
              </span>
            </button>
            <button type="button" className="btn btn--ghost" onClick={loadSample}>
              Load a sample profile
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="callout callout--error" style={{ marginTop: 20 }}>
          {error}
        </div>
      )}

      {result && (
        <div className="panel reveal">
          <div className="section-title">Result</div>
          <div className="gauge-wrap">
            <RiskGauge value={result.attrition_probability} />
            <div className="risk-result">
              <div>
                <span className="risk-prob">{(result.attrition_probability * 100).toFixed(1)}%</span>
                <div className="risk-prob-label">Estimated attrition probability</div>
              </div>
              <span className={`risk-badge ${riskClass}`}>{result.risk_level} risk</span>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600 }}>
                  {(result.retention_probability * 100).toFixed(1)}%
                </span>
                <div className="risk-prob-label">Retention probability</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
