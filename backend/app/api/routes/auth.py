from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.db.session import get_db
from app.models.database import Dataset, Experiment, ModelResult, User
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse

router = APIRouter()


@router.post("/signup", response_model=TokenResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=payload.email.lower(), name=payload.name, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(user.id, {"role": user.role}),
        refresh_token=create_refresh_token(user.id),
        role=user.role,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return TokenResponse(
        access_token=create_access_token(user.id, {"role": user.role}),
        refresh_token=create_refresh_token(user.id),
        role=user.role,
    )


@router.get("/me")
def me(user: User | None = Depends(get_current_user)) -> dict:
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Login required")
    return {"id": user.id, "email": user.email, "name": user.name, "role": user.role, "created_at": user.created_at}


@router.get("/me/history")
def my_history(db: Session = Depends(get_db), user: User | None = Depends(get_current_user)) -> dict:
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Login required")

    datasets = db.query(Dataset).filter(Dataset.owner_id == user.id).order_by(Dataset.created_at.desc()).all()
    experiments = db.query(Experiment).filter(Experiment.owner_id == user.id).order_by(Experiment.created_at.desc()).all()
    results = (
        db.query(ModelResult, Experiment)
        .join(Experiment, ModelResult.experiment_id == Experiment.id)
        .filter(Experiment.owner_id == user.id)
        .order_by(ModelResult.created_at.desc())
        .all()
    )

    return {
        "datasets": [
            {
                "id": dataset.id,
                "filename": dataset.filename,
                "rows": dataset.rows,
                "columns": dataset.columns,
                "statistics": dataset.statistics,
                "created_at": dataset.created_at,
            }
            for dataset in datasets
        ],
        "experiments": [
            {
                "id": experiment.id,
                "dataset_id": experiment.dataset_id,
                "name": experiment.name,
                "algorithm": experiment.algorithm,
                "status": experiment.status,
                "created_at": experiment.created_at,
                "completed_at": experiment.completed_at,
            }
            for experiment in experiments
        ],
        "results": [
            {
                "experiment_id": result.experiment_id,
                "algorithm": result.algorithm,
                "ctr": result.ctr,
                "total_reward": result.total_reward,
                "regret": result.regret,
                "best_ad": result.best_ad,
                "created_at": result.created_at,
            }
            for result, _experiment in results
        ],
    }


@router.post("/forgot-password")
def forgot_password() -> dict[str, str]:
    return {"status": "queued", "message": "Password reset email flow is ready for provider integration."}


@router.post("/verify-email")
def verify_email() -> dict[str, str]:
    return {"status": "verified", "message": "Email verification hook accepted."}


@router.post("/google")
def google_oauth() -> dict[str, str]:
    return {"status": "ready", "message": "Google OAuth callback endpoint is scaffolded."}
