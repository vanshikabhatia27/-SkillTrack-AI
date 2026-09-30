import { useEffect, useState } from "react";
import { getEngineHealth } from "../lib/api.js";
import { IconFunnel, IconShield, IconTarget } from "./icons.jsx";

const NAV_ITEMS = [
  { id: "employment", title: "Employment outcomes", sub: "PMKVY training-to-placement funnel", Icon: IconFunnel },
  { id: "retention", title: "Retention risk", sub: "Predict attrition for an employee", Icon: IconShield },
  { id: "skill-gap", title: "Skill gap", sub: "Compare candidate skills to a role", Icon: IconTarget },
];

export default function Sidebar({ active, onNavigate }) {
  const [health, setHealth] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    getEngineHealth()
      .then((data) => {
        if (!cancelled) setHealth(data.status === "healthy" ? "healthy" : "down");
      })
      .catch(() => {
        if (!cancelled) setHealth("down");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const healthLabel =
    health === "checking" ? "Checking engine…" : health === "healthy" ? "ML engine online" : "ML engine unreachable";

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar__mark">
          <span className="sidebar__mark-word">SkillTrack</span>
          <span className="sidebar__mark-badge">AI</span>
        </div>
        <p className="sidebar__tagline">Employment outcomes, skill gaps and skilling impact.</p>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__link${active === item.id ? " is-active" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={active === item.id ? "page" : undefined}
          >
            <span className="sidebar__link-icon">
              <item.Icon />
            </span>
            <span className="sidebar__link-text">
              <span className="sidebar__link-title">{item.title}</span>
              <span className="sidebar__link-sub">{item.sub}</span>
            </span>
          </button>
        ))}
      </nav>

      <div>
        <div className="sidebar__health">
          <span className={`sidebar__health-dot${health === "healthy" ? " is-healthy" : health === "down" ? " is-down" : ""}`} />
          {healthLabel}
        </div>
        <div className="sidebar__footer">SIH 2026 · Problem statement PS135</div>
      </div>
    </aside>
  );
}
