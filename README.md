# SkillTrack AI — frontend

React + Vite frontend for PS135 (SIH 2026), talking to the FastAPI backend in `backend/main.py`.

Three tools, one per model:

- **Employment outcomes** — `POST /api/employment`, PMKVY training→placement funnel with state/scheme/component/training-type breakdowns and a data-quality anomaly view.
- **Retention risk** — `POST /api/retention`, a form for all 22 fields the retention model was trained on, returning attrition probability and risk band.
- **Skill gap** — `POST /api/skill-gap`, candidate skills vs. a target job's core/optional requirements (147 job titles, autocompleted).

All dropdown options and form fields in `src/lib/constants.js` are read directly off the trained artifacts (`ml/models/*.joblib`) so every request matches what the backend expects.

## Run it

```bash
cd frontend
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend if not localhost:8000
npm run dev
```

Then, in another terminal, run the backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend's CORS defaults already allow `http://localhost:5173` (this Vite dev server).

## Build

```bash
npm run build
```

Outputs static files to `dist/`, deployable anywhere that serves static assets (set `VITE_API_BASE_URL` at build time to your deployed backend URL).
