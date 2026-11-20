const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function request<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(json?.message ?? "Request failed", response.status);
  }

  return json as T;
}