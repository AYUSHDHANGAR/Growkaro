import type { UploadStats, UserSession } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SESSION_KEY = "growkaro.session";

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
};

function getAccessToken() {
  if (typeof window === "undefined") return undefined;
  try {
    const session = window.localStorage.getItem(SESSION_KEY);
    return session ? (JSON.parse(session) as UserSession).accessToken : undefined;
  } catch {
    return undefined;
  }
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

async function authRequest(path: string, payload: AuthPayload): Promise<UserSession | null> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return null;
    const data = await response.json();
    return {
      email: payload.email.toLowerCase(),
      name: payload.name ?? payload.email.split("@")[0],
      role: data.role === "admin" ? "admin" : data.role === "analyst" ? "analyst" : "user",
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      createdAt: new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export function loginUser(payload: AuthPayload) {
  return authRequest("/auth/login", payload);
}

export function signupUser(payload: Required<AuthPayload>) {
  return authRequest("/auth/signup", payload);
}

export async function uploadDataset(file: File): Promise<UploadStats | null> {
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
      adDetails: payload.statistics.ads?.map((ad: { ad: string; impressions: number; clicks: number; ctr: number }) => ({
        ad: ad.ad,
        impressions: ad.impressions,
        clicks: ad.clicks,
        ctr: ad.ctr * 100
      }))
    };
  } catch {
    return null;
  }
}
