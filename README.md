# Quantum-as-a-Service (QaaS) MVP

Production-ready MVP inspired by GitHub + VS Code for quantum developers.

## Architecture

- `frontend/`: React + Vite + Tailwind + Monaco editor
- `backend/`: FastAPI REST API, JWT auth, MongoDB persistence
- `quantum-service/`: Isolated FastAPI service that validates and executes Qiskit code with timeout

## Folder Structure

```txt
qaas/
  frontend/
    src/
      components/
      pages/
      services/
      utils/
    package.json
    vite.config.js
    tailwind.config.js
  backend/
    app/
      api/
      core/
      db/
      models/
      schemas/
      services/
    requirements.txt
  quantum-service/
    app/
      main.py
      executor.py
      templates.py
      validator.py
      schemas.py
    requirements.txt
  .env.example
```

## 1) Prerequisites

- Node.js 20+
- Python 3.11+
- MongoDB (local or cloud)

## 2) Environment

Copy `.env.example` values into each service as needed.

## Quick Integrated Run (Recommended)

From repo root:

```bash
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
npm run dev
```

This starts:

- Quantum service: `http://localhost:8001`
- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:5173`

## Docker Run (One Command + MongoDB)

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Quantum Service: `http://localhost:8001`
- MongoDB: `mongodb://localhost:27017`

Stop containers:

```bash
docker compose down
```

Stop and remove Mongo data volume:

```bash
docker compose down -v
```

## 3) Run Quantum Service

```bash
cd quantum-service
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## 4) Run Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 5) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend defaults to `http://localhost:5173`.

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/{id}`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`

### Quantum

- `POST /api/quantum/execute` (proxy to quantum service)
- `GET /api/quantum/templates`

## Sample Programs

- Bell State
- Hadamard Superposition
- Grover (2-qubit toy search)

These templates are available from `/api/quantum/templates` and preloaded in the editor.
