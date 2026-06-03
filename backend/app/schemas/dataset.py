from pydantic import BaseModel


class DatasetSummary(BaseModel):
    id: str
    filename: str
    rows: int
    columns: int
    ad_columns: list[str]
    statistics: dict
    validation_status: str
