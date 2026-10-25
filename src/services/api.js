const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

export async function inspectMRI(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE}/inspect`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    let message =
      "Unable to inspect MRI study.";

    try {
      const data =
        await response.json();

      message =
        data.detail || message;
    } catch {
      // Keep default error.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function analyzeMRI(
  file,
  seriesUID
) {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "series_uid",
    seriesUID
  );

  const response = await fetch(
    `${API_BASE}/analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    let message =
      "KneeNova analysis failed.";

    try {
      const data =
        await response.json();

      message =
        data.detail || message;
    } catch {
      // Keep default error.
    }

    throw new Error(message);
  }

  return response.json();
}