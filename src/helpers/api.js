
// Get the base API URL and API key from environment variables
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

/**
 * Simple wrapper around the standard fetch() function.
 * It handles common tasks like:
 *  - Adding the base API URL automatically
 *  - Injecting the required API key header
 * This way, I avoid repeating boilerplate fetch code everywhere else in my app.
 */
export function api(path, options = {}) {
  // Adds the "x-api-key" header for authentication automatically
  const headers = {
    "x-api-key": API_KEY,
    ...(options.headers || {}),
  };

  // Call fetch with the combined base URL, provided path, and headers
  return fetch(`${API_URL}${path}`, { ...options, headers });
}
