export async function httpGetJson(url: string, init: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Upstream error ${res.status}: ${body}`);
    }
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

export function ok<T>(data: T, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=15, s-maxage=60",
      "access-control-allow-origin": "*",
      ...extraHeaders
    }
  });
}

export function err(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*"
    }
  });
}
