# Enterprise AI FinOps Platform

Working project scaffold for a FastAPI + React application with PostgreSQL.

## Structure

```text
enterprise-ai-finops-platform/
  backend/
    app/
      api/
      core/
      db/
    requirements.txt
    Dockerfile
  frontend/
    src/
    package.json
    Dockerfile
  docker-compose.yml
  .env.example
```

## Local Setup

Copy environment variables:

```powershell
Copy-Item .env.example .env
```

Create and activate the backend virtual environment:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

Install frontend dependencies:

```powershell
cd frontend
npm install
cd ..
```

Start PostgreSQL:

```powershell
docker compose up -d postgres
```

Run the API:

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --app-dir backend --host 0.0.0.0 --port 8000
```

Run the web app:

```powershell
cd frontend
npm run dev
```

Open:

- API health: http://localhost:8000/health
- API docs: http://localhost:8000/docs
- Web app: http://localhost:5173

## Docker Compose

Run the full stack:

```powershell
Copy-Item .env.example .env
docker compose up --build
```
