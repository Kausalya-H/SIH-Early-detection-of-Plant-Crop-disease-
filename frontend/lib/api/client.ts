const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class AppApiError extends Error {
  statusCode: number;
  detail?: string | Record<string, unknown>;

  constructor(message: string, statusCode: number, detail?: string | Record<string, unknown>) {
    super(message);
    this.name = 'AppApiError';
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Base fetch wrapper with timeout, JSON parsing, error normalization.
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 15000, headers = {}, ...customConfig } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const isFormData = customConfig.body instanceof FormData;
  const mergedHeaders: HeadersInit = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: mergedHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      let errorDetail: string | Record<string, unknown> | undefined;

      try {
        const errorJson = (await response.json()) as Record<string, unknown>;
        if (errorJson) {
          if (typeof errorJson.message === 'string') {
            errorMessage = errorJson.message;
          } else if (typeof errorJson.detail === 'string') {
            errorMessage = errorJson.detail;
          }

          if (typeof errorJson.detail === 'string' || (typeof errorJson.detail === 'object' && errorJson.detail !== null)) {
            errorDetail = errorJson.detail as string | Record<string, unknown>;
          }
        }
      } catch {
        const errorText = await response.text().catch(() => null);
        if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new AppApiError(errorMessage, response.status, errorDetail);
    }

    // Handle empty responses or 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof AppApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AppApiError('Request timed out. Please verify backend connectivity.', 408);
    }

    const message = error instanceof Error ? error.message : 'Network request failed';
    throw new AppApiError(message, 500);
  }
}
