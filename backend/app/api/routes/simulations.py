import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import require_user
from app.db.session import get_db
from app.ml_models.comparison import get_model
from app.models.database import Dataset, Simulation, User
from app.schemas.experiment import SimulateRequest
from app.services.dataset_service import load_dataset

router = APIRouter()


@router.post("/simulate")
def simulate(payload: SimulateRequest, db: Session = Depends(get_db), user: User = Depends(require_user)) -> dict:
    if payload.dataset_id:
        dataset = db.query(Dataset).filter(Dataset.id == payload.dataset_id).first()
        if not dataset:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
        if dataset.owner_id != user.id and user.role != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Dataset access denied")
        frame = load_dataset(dataset.stored_path).head(payload.rounds)
    else:
        frame = synthetic_dataset(payload.rounds)

    try:
        result = get_model(payload.algorithm).fit(frame).to_dict()
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    simulation = Simulation(status="completed", speed=payload.speed, payload=result)
    db.add(simulation)
    db.commit()
    db.refresh(simulation)
    return {"simulation_id": simulation.id, "result": result}


def synthetic_dataset(rounds: int) -> pd.DataFrame:
    rates = [0.05, 0.07, 0.12, 0.09, 0.16, 0.04, 0.1, 0.08]
    rows = []
    for index in range(rounds):
        rows.append([1 if ((index * (ad + 3) + ad) % 100) < int(rate * 100) else 0 for ad, rate in enumerate(rates)])
    return pd.DataFrame(rows, columns=[f"Ad {index + 1}" for index in range(len(rates))])
