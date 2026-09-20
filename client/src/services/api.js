/**
 * Centralized API Service for Right2Know Client
 * Strictly avoids hardcoding backend URLs throughout components.
 */

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// Remove trailing slash if present
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

async function fetchJSON(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders
    });

    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: response.ok, message: text };
    }

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `Server returned HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the Right2Know service. Please check your internet connection or backend server status.');
    }
    throw error;
  }
}

/**
 * Match student profile deterministically against scholarship dataset
 */
export async function matchStudent(profile) {
  return await fetchJSON('/api/match', {
    method: 'POST',
    body: JSON.stringify(profile)
  });
}

/**
 * Fetch all available scholarship schemes
 */
export async function getSchemes() {
  return await fetchJSON('/api/schemes', {
    method: 'GET'
  });
}

/**
 * Fetch details for a specific scholarship scheme by ID
 */
export async function getScheme(id) {
  return await fetchJSON(`/api/schemes/${encodeURIComponent(id)}`, {
    method: 'GET'
  });
}

/**
 * Ask contextual AI guidance assistant
 */
export async function askAssistant(profile, question, schemes = []) {
  return await fetchJSON('/api/ask', {
    method: 'POST',
    body: JSON.stringify({
      profile,
      question,
      schemes
    })
  });
}

/**
 * Fetch latest updates and new scheme count (lightweight polling)
 */
export async function getSchemeUpdates() {
  return await fetchJSON('/api/schemes/updates', {
    method: 'GET'
  });
}

/**
 * Add / Ingest a new scholarship scheme
 */
export async function createScheme(schemeData) {
  return await fetchJSON('/api/schemes', {
    method: 'POST',
    body: JSON.stringify(schemeData)
  });
}

/**
 * Simulate a freshly launched scholarship scheme (for live testing)
 */
export async function seedNewScheme() {
  return await fetchJSON('/api/schemes/seed-new', {
    method: 'POST'
  });
}

/**
 * Check backend health status
 */
export async function checkHealth() {
  return await fetchJSON('/api/health', {
    method: 'GET'
  });
}

export { API_BASE_URL };
