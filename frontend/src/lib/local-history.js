import { getTopResultAds } from "@/lib/analysis";
const SESSION_KEY = "growkaro.session";
const USERS_KEY = "growkaro.users";
const HISTORY_KEY = "growkaro.analysis.history";
const HISTORY_INDEX_KEY = "growkaro.analysis.history.owners";
const GUEST_EMAIL = "guest@growkaro.local";
const memoryStore = new Map();
function normalizeEmail(email, fallback = GUEST_EMAIL) {
    const normalized = String(email ?? "").trim().toLowerCase();
    return normalized || fallback;
}
function normalizeRole(role) {
    return role === "admin" ? "admin" : "user";
}
function normalizeUser(user) {
    const email = normalizeEmail(user.email);
    const role = normalizeRole(user.role);
    return {
        ...user,
        email,
        name: user.name || email.split("@")[0],
        role,
        password: undefined,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt || new Date().toISOString()
    };
}
function normalizeUsers(users) {
    const normalized = users.map(normalizeUser);
    const seen = new Set();
    return normalized.filter((user) => {
        const email = user.email.toLowerCase();
        if (seen.has(email))
            return false;
        seen.add(email);
        return true;
    });
}
function normalizeSession(session) {
    if (!session)
        return null;
    const email = normalizeEmail(session.email, "");
    if (!email)
        return null;
    const role = normalizeRole(session.role);
    const users = normalizeUsers(readJson(USERS_KEY, []));
    const localUser = users.find((user) => user.email.toLowerCase() === email);
    const hasBackendToken = Boolean(session.accessToken);
    const hasLocalPassword = Boolean(localUser?.passwordHash);
    if (role === "admin" && !hasBackendToken)
        return null;
    if (role !== "admin" && !hasBackendToken && !hasLocalPassword)
        return null;
    return {
        ...session,
        email,
        name: session.name || localUser?.name || email.split("@")[0],
        role
    };
}
function canUseStorage() {
    if (typeof window === "undefined")
        return false;
    try {
        const testKey = "growkaro.storage.test";
        window.localStorage.setItem(testKey, "1");
        window.localStorage.removeItem(testKey);
        return true;
    }
    catch {
        return false;
    }
}
function readCookie(key) {
    if (typeof document === "undefined")
        return null;
    const item = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${encodeURIComponent(key)}=`));
    return item ? decodeURIComponent(item.split("=").slice(1).join("=")) : null;
}
function writeCookie(key, value) {
    if (typeof document === "undefined")
        return;
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; max-age=1209600; SameSite=Lax`;
}
function clearCookie(key) {
    if (typeof document === "undefined")
        return;
    document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0; SameSite=Lax`;
}
function readJson(key, fallback) {
    try {
        const value = canUseStorage() ? window.localStorage.getItem(key) : (memoryStore.get(key) ?? (key === SESSION_KEY ? readCookie(key) : null));
        return value ? JSON.parse(value) : fallback;
    }
    catch {
        return fallback;
    }
}
function writeJson(key, value) {
    const serialized = JSON.stringify(value);
    memoryStore.set(key, serialized);
    if (key === SESSION_KEY)
        writeCookie(key, serialized);
    if (!canUseStorage())
        return;
    window.localStorage.setItem(key, serialized);
}
async function hashLocalPassword(email, password) {
    const source = `${normalizeEmail(email)}:${password}:growkaro-local-v2`;
    if (globalThis.crypto?.subtle && typeof TextEncoder !== "undefined") {
        const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
        return `sha256:${Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
    }
    let hash = 0;
    for (let index = 0; index < source.length; index += 1) {
        hash = (hash << 5) - hash + source.charCodeAt(index);
        hash |= 0;
    }
    return `local:${Math.abs(hash).toString(16)}`;
}
async function verifyLocalPassword(user, password) {
    if (!user || user.role === "admin")
        return false;
    if (user.passwordHash) {
        return user.passwordHash === (await hashLocalPassword(user.email, password));
    }
    return Boolean(user.password && user.password === password);
}
function historyBucketKey(email) {
    return `${HISTORY_KEY}.${encodeURIComponent(normalizeEmail(email))}`;
}
function getHistoryOwnerFromKey(key) {
    const prefix = `${HISTORY_KEY}.`;
    if (!key.startsWith(prefix))
        return null;
    const encodedOwner = key.slice(prefix.length);
    if (!encodedOwner || encodedOwner === "owners")
        return null;
    try {
        return normalizeEmail(decodeURIComponent(encodedOwner));
    }
    catch {
        return normalizeEmail(encodedOwner);
    }
}
function makeRecordId() {
    return globalThis.crypto?.randomUUID?.() ?? `record-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function normalizeStats(stats = {}) {
    return {
        filename: stats.filename || "saved-analysis",
        rows: Number(stats.rows ?? 0),
        columns: Number(stats.columns ?? stats.adDetails?.length ?? 0),
        totalClicks: Number(stats.totalClicks ?? 0),
        overallCtr: Number(stats.overallCtr ?? 0),
        bestAd: stats.bestAd || "Pending",
        adDetails: Array.isArray(stats.adDetails) ? stats.adDetails : []
    };
}
function normalizeHistoryRecord(record, fallbackOwner = GUEST_EMAIL) {
    const ownerEmail = normalizeEmail(record?.ownerEmail, fallbackOwner);
    return {
        ...record,
        id: record?.id || makeRecordId(),
        ownerEmail,
        ownerName: record?.ownerName || ownerEmail.split("@")[0],
        createdAt: record?.createdAt || new Date().toISOString(),
        source: record?.source || "upload",
        stats: normalizeStats(record?.stats),
        growScore: Number(record?.growScore ?? 0),
        qualityLabel: record?.qualityLabel || "Saved",
        recommendation: record?.recommendation || "Saved ad analysis.",
        nextActions: Array.isArray(record?.nextActions) ? record.nextActions : []
    };
}
function dedupeHistoryRecords(records) {
    const seen = new Set();
    return records
        .filter(Boolean)
        .map((record) => normalizeHistoryRecord(record))
        .filter((record) => {
        if (seen.has(record.id))
            return false;
        seen.add(record.id);
        return true;
    })
        .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());
}
function updateHistoryOwners(ownerEmail) {
    const owners = new Set(readJson(HISTORY_INDEX_KEY, []).map((email) => normalizeEmail(email)));
    owners.add(normalizeEmail(ownerEmail));
    writeJson(HISTORY_INDEX_KEY, [...owners].sort());
}
function getStoredHistoryOwners() {
    const owners = new Set(readJson(HISTORY_INDEX_KEY, []).map((email) => normalizeEmail(email)));
    getUsers().forEach((user) => owners.add(normalizeEmail(user.email)));
    readJson(HISTORY_KEY, []).forEach((record) => owners.add(normalizeEmail(record?.ownerEmail)));
    memoryStore.forEach((_value, key) => {
        const owner = getHistoryOwnerFromKey(key);
        if (owner)
            owners.add(owner);
    });
    if (canUseStorage()) {
        try {
            for (let index = 0; index < window.localStorage.length; index += 1) {
                const key = window.localStorage.key(index);
                const owner = key ? getHistoryOwnerFromKey(key) : null;
                if (owner)
                    owners.add(owner);
            }
        }
        catch {
            return [...owners];
        }
    }
    return [...owners];
}
function writeOwnerHistory(ownerEmail, records) {
    const owner = normalizeEmail(ownerEmail);
    writeJson(historyBucketKey(owner), dedupeHistoryRecords(records).map((record) => normalizeHistoryRecord(record, owner)).slice(0, 250));
    updateHistoryOwners(owner);
}
function migrateLegacyHistory() {
    const legacyRecords = readJson(HISTORY_KEY, []);
    if (!legacyRecords.length)
        return;
    const grouped = new Map();
    legacyRecords.forEach((record) => {
        const normalized = normalizeHistoryRecord(record);
        const ownerRecords = grouped.get(normalized.ownerEmail) ?? [];
        ownerRecords.push(normalized);
        grouped.set(normalized.ownerEmail, ownerRecords);
    });
    grouped.forEach((records, ownerEmail) => {
        const current = readJson(historyBucketKey(ownerEmail), []);
        writeOwnerHistory(ownerEmail, [...records, ...current]);
    });
}
function syncAggregateHistory() {
    const allRecords = getStoredHistoryOwners()
        .flatMap((ownerEmail) => readJson(historyBucketKey(ownerEmail), []).map((record) => normalizeHistoryRecord(record, ownerEmail)));
    writeJson(HISTORY_KEY, dedupeHistoryRecords(allRecords).slice(0, 250));
}
export function ensureLocalUsers() {
    const users = readJson(USERS_KEY, []);
    const normalizedUsers = normalizeUsers(users);
    if (JSON.stringify(users) !== JSON.stringify(normalizedUsers)) {
        writeJson(USERS_KEY, normalizedUsers);
    }
}
export function getSession() {
    ensureLocalUsers();
    const storedSession = readJson(SESSION_KEY, null);
    const session = normalizeSession(storedSession);
    if (session) {
        writeJson(SESSION_KEY, session);
    }
    else if (storedSession) {
        clearSession();
    }
    return session;
}
export function setSession(session) {
    const normalizedSession = normalizeSession(session);
    if (!normalizedSession) {
        clearSession();
        return null;
    }
    writeJson(SESSION_KEY, normalizedSession);
    return normalizedSession;
}
export function clearSession() {
    memoryStore.delete(SESSION_KEY);
    clearCookie(SESSION_KEY);
    if (!canUseStorage())
        return;
    window.localStorage.removeItem(SESSION_KEY);
}
export function getUsers() {
    ensureLocalUsers();
    return normalizeUsers(readJson(USERS_KEY, []));
}
export async function saveLocalUser(user) {
    ensureLocalUsers();
    const users = getUsers();
    const passwordHash = user.password ? await hashLocalPassword(user.email, user.password) : user.passwordHash;
    const normalizedUser = normalizeUser({ ...user, passwordHash, password: undefined });
    const withoutExisting = users.filter((item) => item.email.toLowerCase() !== normalizedUser.email.toLowerCase());
    writeJson(USERS_KEY, normalizeUsers([normalizedUser, ...withoutExisting]));
}
export async function loginLocalUser(email, password) {
    ensureLocalUsers();
    const user = getUsers().find((item) => item.email.toLowerCase() === normalizeEmail(email));
    if (!user || !(await verifyLocalPassword(user, password)))
        return null;
    if (user.password && !user.passwordHash) {
        await saveLocalUser({ ...user, password });
    }
    const session = {
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: new Date().toISOString()
    };
    setSession(session);
    return session;
}
export function getAllHistory() {
    migrateLegacyHistory();
    const records = getStoredHistoryOwners()
        .flatMap((ownerEmail) => readJson(historyBucketKey(ownerEmail), []).map((record) => normalizeHistoryRecord(record, ownerEmail)));
    const normalizedRecords = dedupeHistoryRecords(records).slice(0, 250);
    writeJson(HISTORY_KEY, normalizedRecords);
    return normalizedRecords;
}
export function getUserHistory(email) {
    migrateLegacyHistory();
    const session = email ? null : getSession();
    const ownerEmail = normalizeEmail(email ?? session?.email);
    return dedupeHistoryRecords(readJson(historyBucketKey(ownerEmail), []).map((record) => normalizeHistoryRecord(record, ownerEmail))).slice(0, 250);
}
export function saveAnalysis(record) {
    migrateLegacyHistory();
    const session = getSession();
    const ownerEmail = normalizeEmail(record?.ownerEmail, session?.email);
    const normalizedRecord = normalizeHistoryRecord({
        ...record,
        ownerEmail,
        ownerName: record?.ownerName || session?.name
    }, ownerEmail);
    const current = readJson(historyBucketKey(ownerEmail), []);
    writeOwnerHistory(ownerEmail, [normalizedRecord, ...current]);
    syncAggregateHistory();
}
export function deleteAnalysis(recordId) {
    migrateLegacyHistory();
    getStoredHistoryOwners().forEach((ownerEmail) => {
        const current = readJson(historyBucketKey(ownerEmail), []);
        const nextRecords = current.filter((record) => record.id !== recordId);
        if (nextRecords.length !== current.length)
            writeOwnerHistory(ownerEmail, nextRecords);
    });
    writeJson(HISTORY_KEY, readJson(HISTORY_KEY, []).filter((record) => record.id !== recordId));
    syncAggregateHistory();
}
export function exportHistoryCsv(records) {
    const header = ["id", "owner", "created", "source", "filename", "growScore", "quality", "ctr", "topAds"];
    const body = dedupeHistoryRecords(records).map((record) => [
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
