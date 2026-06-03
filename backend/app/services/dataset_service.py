from pathlib import Path
from uuid import uuid4

import pandas as pd
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


def safe_upload_path(filename: str) -> Path:
    extension = Path(filename).suffix.lower()
    if extension not in settings.allowed_upload_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed: {', '.join(sorted(settings.allowed_upload_extensions))}",
        )
    return settings.upload_dir / f"{uuid4()}{extension}"


async def save_upload(file: UploadFile) -> Path:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing filename")

    destination = safe_upload_path(file.filename)
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    bytes_written = 0

    with destination.open("wb") as output:
        while chunk := await file.read(1024 * 1024):
            bytes_written += len(chunk)
            if bytes_written > max_bytes:
                destination.unlink(missing_ok=True)
                raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")
            output.write(chunk)

    return destination


def load_dataset(path: str | Path) -> pd.DataFrame:
    path = Path(path)
    if path.suffix.lower() == ".csv":
        frame = pd.read_csv(path)
    elif path.suffix.lower() == ".xlsx":
        frame = pd.read_excel(path)
    else:
        raise ValueError("Unsupported dataset type")
    return clean_and_validate_dataset(frame)


def clean_and_validate_dataset(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.dropna(axis=1, how="all").dropna(axis=0, how="all")
    frame = frame.apply(pd.to_numeric, errors="coerce")
    frame = frame.dropna(axis=0, how="any")

    if frame.empty:
        raise ValueError("Dataset is empty after cleaning.")

    invalid_mask = ~frame.isin([0, 1])
    if invalid_mask.any().any():
        invalid_columns = frame.columns[invalid_mask.any()].astype(str).tolist()
        raise ValueError(f"Dataset must contain only 0 and 1 values. Invalid columns: {invalid_columns}")

    frame.columns = [str(column) for column in frame.columns]
    return frame.astype(int)


def dataset_statistics(frame: pd.DataFrame) -> dict:
    total_impressions = int(frame.shape[0] * frame.shape[1])
    total_clicks = int(frame.sum().sum())
    ad_stats = []
    for column in frame.columns:
        clicks = int(frame[column].sum())
        impressions = int(frame[column].shape[0])
        ad_stats.append(
            {
                "ad": str(column),
                "clicks": clicks,
                "impressions": impressions,
                "ctr": clicks / max(impressions, 1),
            }
        )
    return {
        "total_impressions": total_impressions,
        "total_clicks": total_clicks,
        "overall_ctr": total_clicks / max(total_impressions, 1),
        "ads": ad_stats,
        "best_dataset_ad": max(ad_stats, key=lambda item: item["ctr"]) if ad_stats else None,
    }
