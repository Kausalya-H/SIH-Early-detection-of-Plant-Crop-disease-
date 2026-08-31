export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

const TOKEN_KEY = 'krishirakshak_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const defaultHeaders: Record<string, string> = {};
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const token = getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: null,
        error: errorText || `HTTP error ${response.status}`,
        status: response.status,
      };
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { data, error: null, status: response.status };
    }

    const blobData = (await response.blob()) as unknown as T;
    return { data: blobData, error: null, status: response.status };
  } catch (err: any) {
    return {
      data: null,
      error: err.message || 'Network request failed. Ensure backend server is running.',
      status: 0,
    };
  }
}
