/**
 * Centralized API Client for port-admin
 *
 * Architecture:
 *  - All requests go through `apiRequest()` — a single fetch wrapper.
 *  - Base URL is read from NEXT_PUBLIC_API_URL env variable.
 *    • Local dev  → http://localhost:5000/api   (.env.local)
 *    • Production → https://port-backend-three.vercel.app/api  (Vercel env var)
 *  - Throws a structured ApiError on non-2xx responses.
 *  - Supports GET, POST, PUT, PATCH, DELETE with typed helpers.
 */

const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? 'https://port-backend-three.vercel.app/api'
        : 'http://localhost:5000/api');

// ─── Custom Error Class ───────────────────────────────────────────────────────

export class ApiError extends Error {
    /**
     * @param {string} message
     * @param {number} status
     * @param {any} data  – parsed response body (if available)
     */
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// ─── Core Request Function ────────────────────────────────────────────────────

/**
 * Make a fetch request to the API.
 *
 * @param {string} endpoint        - e.g. '/blogs' or '/blogs/123'
 * @param {RequestInit} [options]  - standard fetch options (method, body, headers…)
 * @returns {Promise<any>}         - parsed JSON response
 * @throws {ApiError}              - on non-2xx HTTP status
 */
export async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        // Only send credentials (cookies) on same-origin or same-site requests.
        // On Vercel (cross-origin), this must be 'omit' unless cookies are
        // SameSite=None; Secure — which requires explicit CORS config on the backend.
        // We default to 'include' so local development works with session cookies.
        credentials: 'include',
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    // If body is FormData, remove Content-Type so browser sets the boundary
    if (config.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const res = await fetch(url, config);

        // Parse response body
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
        // Network / CORS errors
        throw new ApiError(err.message || 'Network error', 0, null);
    }
}

// ─── HTTP Method Helpers ──────────────────────────────────────────────────────

/** GET /endpoint */
export const apiGet = (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' });

/** POST /endpoint with JSON body */
export const apiPost = (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
    });

/** PUT /endpoint with JSON body */
export const apiPut = (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
    });

/** PATCH /endpoint with JSON body */
export const apiPatch = (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(body),
    });

/** DELETE /endpoint */
export const apiDelete = (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' });
