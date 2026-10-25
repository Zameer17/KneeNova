// ============================================================
// API BASE URL CONFIGURATION
// ============================================================

export function getApiBase() {
  try {
    const custom = localStorage.getItem("kneenova_api_base");
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, "");
    }
  } catch {}

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  return "http://127.0.0.1:8000";
}

export function setCustomApiBase(url) {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem("kneenova_api_base");
    } else {
      localStorage.setItem("kneenova_api_base", url.trim().replace(/\/+$/, ""));
    }
  } catch {}
}

export function isMixedContentRisk(url = getApiBase()) {
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    return url.startsWith("http://");
  }
  return false;
}

// ============================================================
// FETCH WITH TIMEOUT & ERROR ENRICHMENT
// ============================================================

export async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      throw new Error(
        "Request timed out. The backend server might still be waking up (Render free instances take ~45s to wake from sleep). Please try again or use Demo Mode."
      );
    }

    const apiBase = getApiBase();
    if (isMixedContentRisk(apiBase)) {
      throw new Error(
        `Mixed Content: You are on an HTTPS website, but the API URL is set to an insecure address (${apiBase}). Set a secure backend URL (https://...) in settings or continue in Demo Mode.`
      );
    }

    if (err.message && err.message.includes("Failed to fetch")) {
      throw new Error(
        `Unable to reach backend at ${apiBase}. The server may be offline or spinning up. You can retry or continue in Demo Mode.`
      );
    }

    throw err;
  }
}

// ============================================================
// LOCAL STORAGE AUTH HELPERS
// ============================================================

export function getStoredToken() {
  try {
    return localStorage.getItem("kneenova_token") || null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("kneenova_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(token, user) {
  try {
    if (token) localStorage.setItem("kneenova_token", token);
    if (user) localStorage.setItem("kneenova_user", JSON.stringify(user));
  } catch (err) {
    console.error("Failed to store auth info:", err);
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem("kneenova_token");
    localStorage.removeItem("kneenova_user");
  } catch (err) {
    console.error("Failed to clear auth info:", err);
  }
}

// ============================================================
// AUTHENTICATION API CALLS
// ============================================================

export async function loginUser({ email, password }) {
  const apiBase = getApiBase();

  const response = await fetchWithTimeout(`${apiBase}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || "Unable to sign in. Please verify your credentials."
    );
  }

  setStoredAuth(data.token, data.user);
  return data;
}

export function createDemoUserSession(email = "demo@kneenova.ai", name = "Dr. Zameer Shaikh") {
  const demoUser = {
    id: 1,
    name: name || "Dr. Zameer Shaikh",
    email: email || "demo@kneenova.ai",
    role: "Orthopedic Radiologist",
    institution: "KneeNova Medical AI Lab (Demo Mode)",
  };
  const demoToken = "demo-session-token-" + Date.now();
  setStoredAuth(demoToken, demoUser);
  return { token: demoToken, user: demoUser };
}

export async function registerUser({ name, email, password, institution, role }) {
  const apiBase = getApiBase();

  const response = await fetchWithTimeout(`${apiBase}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, institution, role }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || "Registration failed. Please check your information."
    );
  }

  setStoredAuth(data.token, data.user);
  return data;
}

export async function fetchCurrentUser() {
  const token = getStoredToken();
  if (!token) return null;

  if (token.startsWith("demo-session-token-")) {
    return getStoredUser();
  }

  try {
    const apiBase = getApiBase();
    const response = await fetchWithTimeout(`${apiBase}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }, 10000);

    if (!response.ok) {
      clearStoredAuth();
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch {
    // If backend is sleeping or unreachable, keep locally cached session
    return getStoredUser();
  }
}

export async function logoutUser() {
  const token = getStoredToken();
  if (token && !token.startsWith("demo-session-token-")) {
    const apiBase = getApiBase();
    fetch(`${apiBase}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {});
  }
  clearStoredAuth();
}

// ============================================================
// MRI ANALYSIS API CALLS
// ============================================================

export async function inspectMRI(file) {
  const apiBase = getApiBase();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithTimeout(`${apiBase}/inspect`, {
    method: "POST",
    body: formData,
  }, 45000);

  if (!response.ok) {
    let message = "Unable to inspect MRI study.";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export async function analyzeMRI(file, seriesUID) {
  const apiBase = getApiBase();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("series_uid", seriesUID);

  const response = await fetchWithTimeout(`${apiBase}/analyze`, {
    method: "POST",
    body: formData,
  }, 90000);

  if (!response.ok) {
    let message = "KneeNova analysis failed.";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}
