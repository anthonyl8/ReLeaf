# ReLeaf Frontend

Vite + React + TypeScript UI for ReLeaf, wired to the htc-2026 backend.

## Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: set VITE_API_URL=http://localhost:8000 (default)
```

## Run

Start the **backend** first (in another terminal):

```bash
cd ../backend
source .venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Then run the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Local Temp card:** Fetches LST from backend `GET /heatmap/49.2827/-123.1207` (Vancouver).
- **Simulate Future:** Captures the map area, sends to backend `POST /generate-vision` (Gemini), shows Before/After slider in the modal.

Backend must be running and have `GEMINI_API_KEY` set for Simulate Future to work.
