import { useEffect, useState } from "react";
import { analyzeSkillGap } from "../lib/api.js";
import { JOB_TITLES } from "../lib/constants.js";
import { IconTarget, IconSpinner, IconCheck, IconCross } from "./icons.jsx";

function MatchMeter({ value, label }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="match-meter">
      <div className="match-meter__top">
        <span className="match-meter__value">{value}%</span>
        <span className="match-meter__label">{label}</span>
      </div>
      <div className="match-meter__track">
        <div className="match-meter__fill" style={{ width: ready ? `${value}%` : 0 }} />
      </div>
    </div>
  );
}

export default function SkillGapPanel() {
  const [targetJob, setTargetJob] = useState("");
  const [skills, setSkills] = useState([]);
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function addSkill() {
    const trimmed = draft.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setDraft("");
  }

  function removeSkill(skill) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function handleDraftKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Backspace" && !draft && skills.length) {
      setSkills((prev) => prev.slice(0, -1));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!targetJob.trim() || skills.length === 0) {
      setError("Enter a target job title and at least one skill.");
      return;
    }
    setError(null);
    setLoading(true);
    analyzeSkillGap(skills, targetJob.trim())
      .then(setResult)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <div className="page-head">
        <span className="page-head__icon">
          <IconTarget width="20" height="20" />
        </span>
        <div>
          <h1>Skill gap</h1>
          <p>
            Compare a candidate's skills against the core and optional requirements observed for a target job title,
            using fuzzy and semantic matching over job-description data.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="panel">
          <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field">
              <label htmlFor="target-job">Target job title</label>
              <input
                id="target-job"
                list="job-titles"
                value={targetJob}
                onChange={(e) => setTargetJob(e.target.value)}
                placeholder="e.g. Data Scientist"
              />
              <datalist id="job-titles">
                {JOB_TITLES.map((title) => (
                  <option key={title} value={title} />
                ))}
              </datalist>
            </div>

            <div className="field">
              <label htmlFor="skills">Candidate skills</label>
              <div className="chip-input">
                {skills.map((skill) => (
                  <span className="chip" key={skill}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="skills"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleDraftKeyDown}
                  onBlur={addSkill}
                  placeholder={skills.length ? "Add another…" : "Type a skill, press Enter"}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={loading}>
              <span className="btn__content">
                {loading && <IconSpinner />}
                {loading ? "Comparing…" : "Compare skills"}
              </span>
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="callout callout--error" style={{ marginTop: 20 }}>
          {error}
        </div>
      )}

      {result && !result.job_found && (
        <div className="callout callout--info" style={{ marginTop: 20 }}>
          "{targetJob}" isn't in the trained set of job titles. Pick one from the suggestions as you type.
        </div>
      )}

      {result && result.job_found && (
        <div className="reveal">
          <div className="panel">
            <div className="section-title">Match for {result.target_job}</div>
            <div className="match-ring-row">
              <MatchMeter value={result.skill_match_percentage} label="Overall skill match" />
              <MatchMeter value={result.core_skill_match_percentage} label="Core skill match" />
              <div>
                <span className="match-metric__value" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--teal)" }}>
                    <IconCheck />
                  </span>
                  {result.matching_summary.matched_count}
                </span>
                <div className="match-metric__label">Skills matched</div>
              </div>
              <div>
                <span className="match-metric__value" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--rose)" }}>
                    <IconCross />
                  </span>
                  {result.matching_summary.missing_count}
                </span>
                <div className="match-metric__label">Skills missing</div>
              </div>
            </div>
            {!result.semantic_matching_available && (
              <p className="empty-note" style={{ marginTop: 10 }}>
                Semantic matching wasn't available for this run — results use exact and fuzzy matching only.
              </p>
            )}
          </div>

          <div className="panel">
            <div className="section-title">Skills</div>
            {result.matched_skills.length > 0 && (
              <>
                <div className="skill-group-label">Matched</div>
                <div>
                  {result.matched_skills.map((skill) => (
                    <span
                      key={skill}
                      className={`skill-chip skill-chip--matched${
                        result.matched_core_skills.includes(skill) ? " skill-chip--core" : ""
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
            {result.missing_skills.length > 0 && (
              <>
                <div className="skill-group-label">Missing</div>
                <div>
                  {result.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className={`skill-chip skill-chip--missing${
                        result.missing_core_skills.includes(skill) ? " skill-chip--core" : ""
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
            <p className="empty-note" style={{ marginTop: 14 }}>
              Outlined chips are core requirements for this role.
            </p>
          </div>

          {result.recommended_skills.length > 0 && (
            <div className="panel">
              <div className="section-title">Recommended next skills to learn</div>
              <div>
                {result.recommended_skills.map((skill) => (
                  <span key={skill} className="skill-chip skill-chip--missing skill-chip--core">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
