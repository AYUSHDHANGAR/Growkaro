const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SESSION_KEY = "growkaro.session";
const AUTH_TIMEOUT_MS = 15000;
function getAccessToken() {
    if (typeof window === "undefined")
        return undefined;
    try {
        const session = window.localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session).accessToken : undefined;
    }
    catch {
        return undefined;
    }
}
async function fetchWithTimeout(input, init = {}, timeoutMs = 4000) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(input, { ...init, signal: controller.signal });
    }
    finally {
        window.clearTimeout(timer);
    }
}
function toSession(payload, data) {
    return {
        email: payload.email.toLowerCase(),
        name: payload.name ?? payload.email.split("@")[0],
        role: data.role === "admin" ? "admin" : "user",
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        createdAt: new Date().toISOString()
    };
}
async function authRequest(path, payload) {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }, AUTH_TIMEOUT_MS);
        if (!response.ok)
            return null;
        const data = await response.json();
        return toSession(payload, data);
    }
    catch {
        return null;
    }
}
export function loginUser(payload) {
    return authRequest("/auth/login", payload);
}
export async function signupUser(payload) {
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }, AUTH_TIMEOUT_MS);
        if (response.status === 409) {
            return { ok: false, reason: "exists" };
        }
        if (!response.ok) {
            return { ok: false, reason: "server" };
        }
        const data = await response.json();
        return { ok: true, session: toSession(payload, data) };
    }
    catch {
        return { ok: false, reason: "offline" };
    }
}
export async function uploadDataset(file) {
    const body = new FormData();
    body.append("file", file);
    const accessToken = getAccessToken();
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/upload-dataset`, {
            method: "POST",
            body,
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
        }, 8000);
        if (!response.ok) {
            return null;
        }
        const payload = await response.json();
        return {
            filename: payload.filename,
            rows: payload.rows,
            columns: payload.columns,
            totalClicks: payload.statistics.total_clicks,
            overallCtr: payload.statistics.overall_ctr * 100,
            bestAd: payload.statistics.best_dataset_ad?.ad ?? "Pending",
            adDetails: payload.statistics.ads?.map((ad) => ({
                ad: ad.ad,
                impressions: ad.impressions,
                clicks: ad.clicks,
                ctr: ad.ctr * 100
            }))
        };
    }
    catch {
        return null;
    }
}
