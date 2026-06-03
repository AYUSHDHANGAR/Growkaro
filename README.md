# Growkaro
<<<<<<< HEAD

Growkaro is a full-stack advertisement optimization platform for quality-product growth. It helps local businesses choose better target ads, explains results in simple language, and keeps professional UCB reinforcement-learning analytics available for analysts.

## What Is Built

- Growkaro-branded Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Recharts frontend.
- FastAPI backend with JWT auth routes, dataset upload, validation, training, analytics, simulations, and leaderboard endpoints.
- Modular ML engine in `backend/app/ml_models/` with UCB, Thompson Sampling, Epsilon Greedy, Softmax, and Random Baseline.
- Target-ad planner, guide/suggestion UI, non-technical result language, and GrowScore performance meter.
- PostgreSQL-ready SQLAlchemy schema for users, datasets, experiments, model results, analytics, reports, simulations, and audit logs.
- Redis/Celery worker scaffold for async training.
- Docker Compose, Kubernetes manifests, and GitHub Actions CI.

## Core UCB Logic

The backend implements the requested UCB formula:

```python
average_reward = sum_of_rewards[i] / number_of_selections[i]
delta_i = sqrt((3/2) * log(n + 1) / number_of_selections[i])
upper_bound = average_reward + delta_i
```

The model explores unselected ads first, then balances exploration and exploitation by selecting the ad with the highest upper confidence bound.

## Local Development

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Run the backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend docs:

```text
http://localhost:8000/docs
```

Run the full stack with Docker:

```bash
docker compose up --build
```

## Main API Endpoints

- `POST /upload-dataset`
- `POST /train-model`
- `GET /results/{id}`
- `GET /analytics/{id}`
- `POST /simulate`
- `GET /leaderboard`
- `POST /compare-models/{dataset_id}`
- `POST /auth/signup`
- `POST /auth/login`

## Dataset Format

Datasets must be CSV or XLSX files containing only binary values:

- `1` means the user clicked the ad.
- `0` means the user did not click the ad.

Each column is an ad. Each row is a user impression.

## Project Structure

```text
frontend/              Next.js SaaS UI
backend/               FastAPI backend and ML engine
backend/app/ml_models/ Modular bandit algorithms
infra/k8s/             Kubernetes deployment manifests
.github/workflows/     CI pipeline
docker-compose.yml     Local production-like stack
```

## Production Notes

Before real deployment, replace development secrets, add managed PostgreSQL and Redis, configure email/OAuth providers, add Alembic migrations, connect object storage for uploads/reports, and enable HTTPS at the ingress/load balancer.
=======
coding is fun lets contribute .
>>>>>>> 683e32364af214ffb6f740a2968fd21ddcd72a02
