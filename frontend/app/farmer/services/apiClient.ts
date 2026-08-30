export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

function getAuthToken(): string | null {
  try {
    const saved = localStorage.getItem("krishi_auth_session");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed?.token || null;
    }
  } catch {}
  return null;
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {};

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    // Merge with any caller-provided headers
    const callerHeaders = options.headers as Record<string, string> || {};
    const finalHeaders = { ...headers, ...callerHeaders };

    const response = await fetch(url, {
      ...options,
      headers: finalHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: errorText || "HTTP error " + response.status, status: response.status };
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return { data, error: null, status: response.status };
    }

    const blobData = (await response.blob()) as unknown as T;
    return { data: blobData, error: null, status: response.status };
  } catch (err: any) {
    return { data: null, error: err.message || "Network request failed.", status: 0 };
  }
}
