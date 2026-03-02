/**
 * Centralized API Client for port-admin
 *
 * BASE URL resolution order:
 *  1. NEXT_PUBLIC_API_URL env var (set in Vercel dashboard for production)
 *  2. Falls back to Vercel backend URL if running in browser on non-localhost
 *  3. Falls back to localhost:5000 for local dev
 *
 * NOTE: NEXT_PUBLIC_* vars are inlined at BUILD TIME by Next.js.
 *       The runtime window check is a safety net for missing env vars.
 */

// ─── Base URL ─────────────────────────────────────────────────────────────────

// This is evaluated at runtime in the browser (client components)
function getBaseUrl() {
    // 1. Env var is always preferred — set this in Vercel dashboard
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    // 2. Runtime fallback: if running in browser and NOT on localhost → Vercel backend
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
        return 'https://port-backend-three.vercel.app/api';
    }
    // 3. Local development fallback
    return 'http://localhost:5000/api';
}

// ─── Custom Error Class ───────────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// ─── Core Request Function ────────────────────────────────────────────────────

export async function apiRequest(endpoint, options = {}) {
    const BASE_URL = getBaseUrl(); // resolved at call-time, not module load time
    const url = `${BASE_URL}${endpoint}`;

    const config = {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    // If body is FormData, let browser set Content-Type with boundary
    if (config.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const res = await fetch(url, config);

        let data = null;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        if (!res.ok) {
            const message =
                data && typeof data === 'object' && data.message
                    ? data.message
                    : `HTTP ${res.status}: ${res.statusText}`;
            throw new ApiError(message, res.status, data);
        }

        return data;
    } catch (err) {
        if (err instanceof ApiError) throw err;
        // Network / CORS error — log the URL being called to help debug
        console.error(`[API] fetch failed → ${url}`, err.message);
        throw new ApiError(err.message || 'Network error — check API URL and CORS', 0, null);
    }
}

// ─── HTTP Method Helpers ──────────────────────────────────────────────────────

export const apiGet = (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' });

export const apiPost = (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });

export const apiPut = (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });

export const apiPatch = (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });

export const apiDelete = (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' });
