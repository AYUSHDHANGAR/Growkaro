from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, auth, datasets, experiments, simulations
from app.core.config import settings
from app.core.security import hash_password
from app.db.session import Base, SessionLocal, engine
from app.models.database import User


def ensure_default_admin() -> None:
    if not settings.default_admin_email or not settings.default_admin_password:
        return

    with SessionLocal() as db:
        email = settings.default_admin_email.lower()
        admin_user = db.query(User).filter(User.email == email).first()
        if admin_user:
            if admin_user.role != "admin":
                admin_user.role = "admin"
                db.commit()
            return

        db.add(
            User(
                email=email,
                name=settings.default_admin_name,
                password_hash=hash_password(settings.default_admin_password),
                role="admin",
                is_verified=True,
            )
        )
        db.commit()


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    Base.metadata.create_all(bind=engine)
    ensure_default_admin()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Growkaro API",
        description="Quality-product advertisement optimization and reinforcement learning analytics platform.",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def security_headers(request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

    app.include_router(auth.router, prefix="/auth", tags=["auth"])
    app.include_router(datasets.router, tags=["datasets"])
    app.include_router(experiments.router, tags=["experiments"])
    app.include_router(simulations.router, tags=["simulations"])
    app.include_router(admin.router, prefix="/admin", tags=["admin"])

    @app.get("/health")
    def health_check() -> dict[str, str]:
        return {"status": "healthy", "service": "growkaro"}

    return app


app = create_app()
