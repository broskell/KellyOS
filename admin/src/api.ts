export type ApiError = { status: number; errors: string[] };

export class EditingApiError extends Error {
  readonly status: number;
  readonly errors: string[];

  constructor(status: number, errors: string[]) {
    super(errors.join("; ") || `HTTP ${status}`);
    this.status = status;
    this.errors = errors;
  }
}

export async function editingFetch<T>(
  apiUrl: string,
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${apiUrl}${path}`, { ...init, headers });
  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    errors?: string[];
    error?: string;
  };
  if (!res.ok) {
    const errors = json.errors ?? (json.error ? [json.error] : [`HTTP ${res.status}`]);
    throw new EditingApiError(res.status, errors);
  }
  return json as T;
}
