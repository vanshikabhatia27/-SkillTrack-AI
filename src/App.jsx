import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import EmploymentPanel from "./components/EmploymentPanel.jsx";
import RetentionPanel from "./components/RetentionPanel.jsx";
import SkillGapPanel from "./components/SkillGapPanel.jsx";

export default function App() {
  const [active, setActive] = useState("employment");

  return (
    <div className="shell">
      <Sidebar active={active} onNavigate={setActive} />
      <main className="main">
        {active === "employment" && <EmploymentPanel />}
        {active === "retention" && <RetentionPanel />}
        {active === "skill-gap" && <SkillGapPanel />}
      </main>
    </div>
  );
}
