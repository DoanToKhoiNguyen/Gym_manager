export class ApiError extends Error {
  status: number;
  code: string;
  field?: string;

  constructor(status: number, code: string, message: string, field?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Không kết nối được máy chủ");
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const e = data?.error;
    throw new ApiError(
      res.status,
      e?.code ?? "UNKNOWN",
      e?.message ?? "Có lỗi xảy ra",
      e?.field,
    );
  }
  return data as T;
}