const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

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
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Unable to sign in. Please verify your credentials.");
  }

  setStoredAuth(data.token, data.user);
  return data;
}

export async function registerUser({ name, email, password, institution, role }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, institution, role }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Registration failed. Please check your information.");
  }

  setStoredAuth(data.token, data.user);
  return data;
}

export async function fetchCurrentUser() {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      clearStoredAuth();
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch {
    // If backend is sleeping/offline, return locally cached user
    return getStoredUser();
  }
}

export async function logoutUser() {
  const token = getStoredToken();
  if (token) {
    fetch(`${API_BASE}/auth/logout`, {
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
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/inspect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "Unable to inspect MRI study.";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Keep default error.
    }
    throw new Error(message);
  }

  return response.json();
}

export async function analyzeMRI(file, seriesUID) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("series_uid", seriesUID);

  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "KneeNova analysis failed.";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Keep default error.
    }
    throw new Error(message);
  }

  return response.json();
}
