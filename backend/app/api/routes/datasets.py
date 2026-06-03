from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import require_user
from app.db.session import get_db
from app.models.database import Dataset, User
from app.schemas.dataset import DatasetSummary
from app.services.dataset_service import dataset_statistics, load_dataset, save_upload

router = APIRouter()


@router.post("/upload-dataset", response_model=DatasetSummary)
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
) -> DatasetSummary:
    stored_path = await save_upload(file)
    try:
        frame = load_dataset(stored_path)
    except ValueError as error:
        stored_path.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(error)) from error

    dataset = Dataset(
        owner_id=user.id,
        filename=file.filename or stored_path.name,
        stored_path=str(stored_path),
        rows=int(frame.shape[0]),
        columns=int(frame.shape[1]),
        ad_columns=[str(column) for column in frame.columns],
        statistics=dataset_statistics(frame),
        validation_status="valid",
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return DatasetSummary(
        id=dataset.id,
        filename=dataset.filename,
        rows=dataset.rows,
        columns=dataset.columns,
        ad_columns=dataset.ad_columns,
        statistics=dataset.statistics,
        validation_status=dataset.validation_status,
    )


@router.get("/datasets/{dataset_id}", response_model=DatasetSummary)
def get_dataset(
    dataset_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(require_user),
) -> DatasetSummary:
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
    if dataset.owner_id and dataset.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Dataset access denied")
    return DatasetSummary(
        id=dataset.id,
        filename=dataset.filename,
        rows=dataset.rows,
        columns=dataset.columns,
        ad_columns=dataset.ad_columns,
        statistics=dataset.statistics,
        validation_status=dataset.validation_status,
    )
