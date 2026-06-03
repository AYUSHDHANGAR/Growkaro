from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "optictr_ai",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

celery_app.conf.update(task_track_started=True, worker_prefetch_multiplier=1)
