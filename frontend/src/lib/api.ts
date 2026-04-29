const AUTH_EVENT = 'insightforge:unauthorized';

function getAuthHeaders(extra?: HeadersInit): HeadersInit {
  const token = localStorage.getItem('insightforge_token');
  const base: Record<string, string> = {};
  if (token) {
    base.Authorization = `Bearer ${token}`;
  }
  return { ...base, ...(extra || {}) };
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = getAuthHeaders(init.headers);
  const response = await fetch(path, { ...init, headers });
  if (response.status === 401) {
    localStorage.removeItem('insightforge_token');
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return response;
}

export function onUnauthorized(handler: () => void) {
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
}
