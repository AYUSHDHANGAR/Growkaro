from pydantic import BaseModel, Field


class TrainModelRequest(BaseModel):
    dataset_id: str
    algorithm: str = Field(default="ucb")
    name: str | None = None
    parameters: dict = Field(default_factory=dict)


class SimulateRequest(BaseModel):
    dataset_id: str | None = None
    algorithm: str = "ucb"
    rounds: int = Field(default=500, ge=10, le=10000)
    speed: int = Field(default=1, ge=1, le=20)


class ModelResultResponse(BaseModel):
    experiment_id: str
    algorithm: str
    total_reward: float
    ctr: float
    regret: float
    best_ad: str
    payload: dict
