import { getTopResultAds } from "@/lib/analysis";
import type { AnalysisRecord, SavedUser, UserSession } from "@/types";

const SESSION_KEY = "growkaro.session";
const USERS_KEY = "growkaro.users";
const HISTORY_KEY = "growkaro.analysis.history";
const memoryStore = new Map<string, string>();

const demoAdmin: SavedUser = {
  email: "admin@growkaro.com",
  name: "Growkaro Admin",
  role: "admin",
  password: "Growkaro@123",
  createdAt: "2026-05-29T00:00:00.000Z"
};

function canUseStorage() {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "growkaro.storage.test";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readCookie(key: string) {
  if (typeof document === "undefined") return null;
  const item = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${encodeURIComponent(key)}=`));
  return item ? decodeURIComponent(item.split("=").slice(1).join("=")) : null;
}

function writeCookie(key: string, value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; max-age=1209600; SameSite=Lax`;
}

function clearCookie(key: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0; SameSite=Lax`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = canUseStorage() ? window.localStorage.getItem(key) : (memoryStore.get(key) ?? (key === SESSION_KEY ? readCookie(key) : null));
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  const serialized = JSON.stringify(value);
  memoryStore.set(key, serialized);
  if (key === SESSION_KEY) writeCookie(key, serialized);
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, serialized);
}

export function ensureDemoAdmin() {
  const users = readJson<SavedUser[]>(USERS_KEY, []);
  const exists = users.some((user) => user.email.toLowerCase() === demoAdmin.email);
  if (!exists) {
    writeJson(USERS_KEY, [demoAdmin, ...users]);
  }
}

export function getSession(): UserSession | null {
  ensureDemoAdmin();
  return readJson<UserSession | null>(SESSION_KEY, null);
}

export function setSession(session: UserSession) {
  writeJson(SESSION_KEY, session);
}

export function clearSession() {
  memoryStore.delete(SESSION_KEY);
  clearCookie(SESSION_KEY);
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getUsers() {
  ensureDemoAdmin();
  const users = readJson<SavedUser[]>(USERS_KEY, []);
  const hasAdmin = users.some((user) => user.email.toLowerCase() === demoAdmin.email);
  return hasAdmin ? users : [demoAdmin, ...users];
}

export function saveLocalUser(user: SavedUser) {
  ensureDemoAdmin();
  const users = getUsers();
  const withoutExisting = users.filter((item) => item.email.toLowerCase() !== user.email.toLowerCase());
  writeJson(USERS_KEY, [user, ...withoutExisting]);
}

export function loginLocalUser(email: string, password: string): UserSession | null {
  ensureDemoAdmin();
  const user = getUsers().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) return null;
  const session: UserSession = {
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: new Date().toISOString()
  };
  setSession(session);
  return session;
}

export function getAllHistory() {
  return readJson<AnalysisRecord[]>(HISTORY_KEY, []);
}

export function getUserHistory(email?: string) {
  const session = getSession();
  const ownerEmail = email ?? session?.email ?? "guest@growkaro.local";
  return getAllHistory().filter((record) => record.ownerEmail.toLowerCase() === ownerEmail.toLowerCase());
}

export function saveAnalysis(record: AnalysisRecord) {
  const history = getAllHistory();
  writeJson(HISTORY_KEY, [record, ...history].slice(0, 250));
}

export function deleteAnalysis(recordId: string) {
  writeJson(
    HISTORY_KEY,
    getAllHistory().filter((record) => record.id !== recordId)
  );
}

export function exportHistoryCsv(records: AnalysisRecord[]) {
  const header = ["id", "owner", "created", "source", "filename", "growScore", "quality", "ctr", "topAds"];
  const body = records.map((record) => [
    record.id,
    record.ownerEmail,
    record.createdAt,
    record.source,
    record.stats.filename,
    record.growScore,
    record.qualityLabel,
    record.stats.overallCtr.toFixed(2),
    getTopResultAds(record.stats)
      .map((ad) => `#${ad.rank} ${ad.ad}`)
      .join(" | ")
  ]);
  const csv = [header, ...body]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "growkaro-analysis-history.csv";
  link.click();
  URL.revokeObjectURL(url);
}
