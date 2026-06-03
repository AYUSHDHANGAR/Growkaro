from app.workers.celery_app import celery_app


@celery_app.task(name="train_experiment")
def train_experiment_task(experiment_id: str) -> dict[str, str]:
    return {"experiment_id": experiment_id, "status": "queued-for-api-training"}
