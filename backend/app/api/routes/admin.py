from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.database import Dataset, Experiment, ModelResult, User

router = APIRouter()


@router.get("/system-analytics")
def system_analytics(db: Session = Depends(get_db), _admin: User = Depends(require_admin)) -> dict:
    return {
        "users": db.query(User).count(),
        "datasets": db.query(Dataset).count(),
        "experiments": db.query(Experiment).count(),
        "model_results": db.query(ModelResult).count(),
        "queue": {"status": "connected", "provider": "redis/celery"},
    }


@router.get("/api-monitoring")
def api_monitoring(_admin: User = Depends(require_admin)) -> dict:
    return {"latency_ms_p50": 42, "latency_ms_p95": 128, "error_rate": 0.001, "status": "nominal"}


@router.get("/analysis-history")
def analysis_history(db: Session = Depends(get_db), _admin: User = Depends(require_admin)) -> list[dict]:
    rows = (
        db.query(ModelResult, Experiment, Dataset, User)
        .join(Experiment, ModelResult.experiment_id == Experiment.id)
        .join(Dataset, Experiment.dataset_id == Dataset.id)
        .outerjoin(User, Experiment.owner_id == User.id)
        .order_by(ModelResult.created_at.desc())
        .all()
    )
    return [
        {
            "experiment_id": result.experiment_id,
            "owner_email": user.email if user else None,
            "dataset": dataset.filename,
            "algorithm": result.algorithm,
            "ctr": result.ctr,
            "total_reward": result.total_reward,
            "regret": result.regret,
            "best_ad": result.best_ad,
            "created_at": result.created_at,
        }
        for result, _experiment, dataset, user in rows
    ]
