# Joblens

> **See your next move.** AI-powered resume matcher and role predictor with a terminal-inspired Nothing OS aesthetic.

Joblens reads your resume and tells you two things: how well you match a specific job, and what role you should actually be aiming for. Upload a PDF, get instant skill-gap analysis or a predicted role with live openings.

---

## Features

- **Resume Analysis** — Score your resume against any job description. See matched skills, missing skills, and an overall match percentage.
- **Predict My Role** — Let the AI detect your best-fit job role based on your resume, then surface live job openings matched to your profile.
- **One-click Apply** — Jump straight from a recommended job to its application page.
- **Responsive** — Clean split-pane layout on laptops, stacked layout on phones — no broken UI when results come in.
- **Nothing OS vibe** — Monospace typography, dot-matrix accents, high-contrast dark UI.

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) v1 (React 19, SSR-ready)
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4 + custom design tokens in `src/styles.css`
- **Routing:** TanStack Router (file-based)
- **Data:** TanStack Query
- **Runtime Target:** Cloudflare Workers (edge)
- **Backend:** External FastAPI service (configured via `VITE_API_URL`)

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) (or Node.js 20+)
- A running Joblens backend API

### Install
```bash
bun install
```

### Configure
Create a `.env` file at the project root:
```bash
VITE_API_URL=https://your-backend-url.com
```

### Run
```bash
bun run dev
```
Open [http://localhost:5173](http://localhost:5173).

### Build
```bash
bun run build
```

---

## Project Structure

```
src/
├── routes/              # File-based routes
│   ├── __root.tsx       # Root layout + metadata
│   ├── index.tsx        # Landing page
│   ├── analysis.tsx     # Resume Analysis page
│   └── predict.tsx      # Predict Role page
├── components/
│   ├── NavBar.tsx
│   ├── UploadZone.tsx
│   └── ui/              # shadcn/ui primitives
├── lib/
│   └── api.ts           # Backend client
└── styles.css           # Design tokens + global styles
```

---

## API Contract

The frontend expects two endpoints from your backend:

### `POST /resume-analysis`
**Form data:** `UserFile` (PDF), `raw_jd_text` (string)
**Response:**
```json
{
  "data": {
    "match_score": 0.82,
    "matched_skills": ["python", "react"],
    "missing_skills": ["kubernetes"]
  }
}
```

### `POST /predict-role`
**Form data:** `UserFile` (PDF)
**Response:**
```json
{
  "data": {
    "predicted_role": "Frontend Engineer",
    "jobs": [
      { "title": "...", "company": "...", "location": "...", "link": "..." }
    ]
  }
}
```

---

## Deployment

The project ships with a `wrangler.jsonc` for Cloudflare Workers deployment. Push to your connected GitHub repo or deploy directly:

```bash
bun run build
bunx wrangler deploy
```

---

## License

MIT — do whatever you want, just don't blame us.
