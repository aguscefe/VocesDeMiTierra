export async function api<T = any>(path: string, method = "GET", body?: unknown): Promise<T> {
  let token: string | undefined;
  if (method !== "GET") {
    const response = await fetch("/api/csrf", { credentials: "same-origin", headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("No se pudo iniciar la sesión del servidor.");
    token = (await response.json()).token;
  }
  const file = body instanceof FormData;
  const response = await fetch(`/api/${path}`, {
    method, credentials: "same-origin",
    headers: { Accept: "application/json", ...(token ? { "X-CSRF-TOKEN": token } : {}), ...(!file && body !== undefined ? { "Content-Type": "application/json" } : {}) },
    body: body === undefined ? undefined : file ? body : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({ message: "Respuesta inválida del servidor." }));
  if (!response.ok) throw new Error(Object.values(data.errors || {}).flat().join(" ") || data.message || "No se pudo completar la operación.");
  return data as T;
}
