// src/helpers/api.js
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Tiny wrapper around fetch
 *   • prefixes the URL
 *   • injects x‑api‑key
 */
export function api(path, options = {}) {
  const headers = {
    "x-api-key": API_KEY,
    ...(options.headers || {}),
  };

  return fetch(`${API_URL}${path}`, { ...options, headers });
}
