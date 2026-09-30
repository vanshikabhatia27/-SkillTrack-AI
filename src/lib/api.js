const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

async function postJSON(path, body) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    throw new Error(
      `Could not reach the PS135 API at ${BASE_URL}. Is the backend running? (${networkError.message})`
    );
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = payload && payload.detail ? payload.detail : `Request failed with status ${response.status}`;
    throw new Error(detail);
  }
  return payload;
}

export function getEngineHealth() {
  return fetch(`${BASE_URL}/health`).then((res) => {
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  });
}

export function analyzeEmployment(filters) {
  return postJSON("/api/employment", { filters: filters || null });
}

export function predictRetention(employeeData) {
  return postJSON("/api/retention", { employee_data: employeeData });
}

export function analyzeSkillGap(candidateSkills, targetJob) {
  return postJSON("/api/skill-gap", { candidate_skills: candidateSkills, target_job: targetJob });
}
