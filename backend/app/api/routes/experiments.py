from datetime import datetime, timezone
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from app.api.deps import require_user
from app.db.session import get_db
from app.ml_models.comparison import compare_algorithms, get_model
from app.models.database import Analytics, Dataset, Experiment, ModelResult, User
from app.schemas.experiment import ModelResultResponse, TrainModelRequest
from app.services.dataset_service import load_dataset
from app.services.insight_service import generate_insights

router = APIRouter()


@router.post("/train-model", response_model=ModelResultResponse)
def train_model(
    payload: TrainModelRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
) -> ModelResultResponse:
    dataset = db.query(Dataset).filter(Dataset.id == payload.dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    if dataset.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Dataset access denied")

    experiment = Experiment(
        owner_id=user.id,
        dataset_id=dataset.id,
        name=payload.name or f"{payload.algorithm.upper()} optimization",
        algorithm=payload.algorithm,
        parameters=payload.parameters,
        status="running",
    )
    db.add(experiment)
    db.commit()
    db.refresh(experiment)

    frame = load_dataset(dataset.stored_path)
    result = get_model(payload.algorithm, payload.parameters).fit(frame).to_dict()
    insights = generate_insights(result)

    experiment.status = "completed"
    experiment.completed_at = datetime.now(timezone.utc)
    model_result = ModelResult(
        experiment_id=experiment.id,
        algorithm=result["algorithm"],
        total_reward=result["total_reward"],
        ctr=result["ctr"],
        regret=result["regret"],
        best_ad=result["best_ad"],
        payload=result,
    )
    analytics = Analytics(experiment_id=experiment.id, insights=insights, chart_payload=result)
    db.add_all([model_result, analytics])
    db.commit()

    return ModelResultResponse(
        experiment_id=experiment.id,
        algorithm=result["algorithm"],
        total_reward=result["total_reward"],
        ctr=result["ctr"],
        regret=result["regret"],
        best_ad=result["best_ad"],
        payload=result,
    )


@router.get("/results/{experiment_id}", response_model=ModelResultResponse)
def get_results(
    experiment_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
) -> ModelResultResponse:
    result = db.query(ModelResult).filter(ModelResult.experiment_id == experiment_id).first()
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    if experiment and experiment.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Result access denied")
    return ModelResultResponse(
        experiment_id=experiment_id,
        algorithm=result.algorithm,
        total_reward=result.total_reward,
        ctr=result.ctr,
        regret=result.regret,
        best_ad=result.best_ad,
        payload=result.payload,
    )


@router.get("/results/{experiment_id}/report.pdf")
def get_result_report_pdf(
    experiment_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
) -> StreamingResponse:
    result = db.query(ModelResult).filter(ModelResult.experiment_id == experiment_id).first()
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not result or not experiment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Result not found")
    if experiment.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Report access denied")

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 54

    pdf.setTitle("GrowKaro Result Report")
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawString(54, y, "GrowKaro Result Report")
    y -= 34
    pdf.setFont("Helvetica", 11)
    pdf.drawString(54, y, f"Experiment: {experiment.name}")
    y -= 18
    pdf.drawString(54, y, f"Algorithm: {result.algorithm.upper()}  |  Best ad: {result.best_ad}")
    y -= 18
    pdf.drawString(54, y, f"CTR: {result.ctr * 100:.2f}%  |  Total reward: {result.total_reward:,.0f}  |  Regret: {result.regret:,.0f}")
    y -= 28

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(54, y, "Ad performance")
    y -= 22
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(54, y, "Ad")
    pdf.drawString(220, y, "Selections")
    pdf.drawString(330, y, "Rewards")
    pdf.drawString(440, y, "Reward rate")
    y -= 14
    pdf.setFont("Helvetica", 10)

    labels = result.payload.get("ad_labels", [])
    selections = result.payload.get("selections", [])
    rewards = result.payload.get("rewards_by_ad", [])
    for index, label in enumerate(labels[:18]):
        selection_count = selections[index] if index < len(selections) else 0
        reward_count = rewards[index] if index < len(rewards) else 0
        reward_rate = reward_count / max(selection_count, 1)
        pdf.drawString(54, y, str(label))
        pdf.drawRightString(280, y, f"{selection_count:,}")
        pdf.drawRightString(390, y, f"{reward_count:,}")
        pdf.drawRightString(510, y, f"{reward_rate * 100:.2f}%")
        y -= 16
        if y < 80:
            pdf.showPage()
            y = height - 54

    y -= 12
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(54, y, "Recommendation")
    y -= 20
    pdf.setFont("Helvetica", 10)
    pdf.drawString(54, y, f"Promote {result.best_ad} first and keep one challenger creative live for controlled learning.")
    y -= 16
    pdf.drawString(54, y, "Use CTR, reward rate, and regret together before increasing the campaign budget.")

    pdf.save()
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="growkaro-{experiment_id}.pdf"'},
    )


@router.get("/analytics/{experiment_id}")
def get_analytics(
    experiment_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
) -> dict:
    analytics = db.query(Analytics).filter(Analytics.experiment_id == experiment_id).first()
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
    if not analytics:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analytics not found")
    if experiment and experiment.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Analytics access denied")
    return {"experiment_id": experiment_id, "insights": analytics.insights, "charts": analytics.chart_payload}


@router.get("/leaderboard")
def leaderboard(db: Session = Depends(get_db), _user: User = Depends(require_user)) -> list[dict]:
    rows = db.query(ModelResult).order_by(ModelResult.ctr.desc()).limit(20).all()
    return [
        {
            "experiment_id": row.experiment_id,
            "algorithm": row.algorithm,
            "ctr": row.ctr,
            "total_reward": row.total_reward,
            "best_ad": row.best_ad,
        }
        for row in rows
    ]


@router.post("/compare-models/{dataset_id}")
def compare_models(dataset_id: str, db: Session = Depends(get_db), user: User = Depends(require_user)) -> dict:
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    if dataset.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Dataset access denied")
    frame = load_dataset(dataset.stored_path)
    return compare_algorithms(frame)
