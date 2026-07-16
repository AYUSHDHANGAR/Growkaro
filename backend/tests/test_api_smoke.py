from fastapi.testclient import TestClient


def test_auth_upload_and_training_flow(monkeypatch, tmp_path) -> None:
    monkeypatch.setenv("DATABASE_URL", f"sqlite:///{(tmp_path / 'api.db').as_posix()}")
    monkeypatch.setenv("UPLOAD_DIR", str(tmp_path / "uploads"))
    monkeypatch.setenv("JWT_SECRET_KEY", "test-secret")

    from app.db.session import engine
    from app.main import app

    try:
        with TestClient(app) as client:
            signup = client.post(
                "/auth/signup",
                json={"email": "ApiUser@Example.com", "name": "Api User", "password": "strong-password"},
            )
            assert signup.status_code == 200
            tokens = signup.json()

            duplicate = client.post(
                "/auth/signup",
                json={"email": "apiuser@example.com", "name": "Api User", "password": "strong-password"},
            )
            assert duplicate.status_code == 409

            login = client.post(
                "/auth/login",
                json={"email": "APIUSER@example.com", "password": "strong-password"},
            )
            assert login.status_code == 200

            refresh_auth = client.get("/auth/me", headers={"Authorization": f"Bearer {tokens['refresh_token']}"})
            assert refresh_auth.status_code == 401

            headers = {"Authorization": f"Bearer {tokens['access_token']}"}
            uploaded = client.post(
                "/upload-dataset",
                files={"file": ("ads.csv", b"Ad 1,Ad 2\n1,0\n0,1\n1,1\n", "text/csv")},
                headers=headers,
            )
            assert uploaded.status_code == 200
            dataset_id = uploaded.json()["id"]

            trained = client.post("/train-model", json={"dataset_id": dataset_id, "algorithm": "ucb"}, headers=headers)
            assert trained.status_code == 200
            experiment_id = trained.json()["experiment_id"]

            results = client.get(f"/results/{experiment_id}", headers=headers)
            assert results.status_code == 200

            invalid_algorithm = client.post(
                "/train-model",
                json={"dataset_id": dataset_id, "algorithm": "not-real"},
                headers=headers,
            )
            assert invalid_algorithm.status_code == 400
    finally:
        engine.dispose()
