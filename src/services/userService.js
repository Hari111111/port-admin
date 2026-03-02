/**
 * User / Auth Service
 * All API calls related to /api/users (auth + user management)
 */

import { apiGet, apiPost } from '@/lib/api';

const ENDPOINT = '/users';

/**
 * Login with email & password. Sets HTTP-only JWT cookie via backend.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ _id, name, email, isAdmin }>}
 */
export const login = (credentials) => apiPost(`${ENDPOINT}/login`, credentials);

/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<{ _id, name, email, isAdmin }>}
 */
export const register = (userData) => apiPost(ENDPOINT, userData);

/**
 * Logout — clears the JWT cookie on the server.
 * @returns {Promise<{ message: string }>}
 */
export const logout = () => apiPost(`${ENDPOINT}/logout`, {});

/**
 * Get currently logged-in user info (validates the JWT cookie).
 * @returns {Promise<{ _id, name, email, isAdmin }>}
 */
export const getMe = () => apiGet(`${ENDPOINT}/me`);

/**
 * Fetch all users (admin-protected)
 * @returns {Promise<Array>}
 */
export const getAllUsers = () => apiGet(ENDPOINT);

/**
 * Fetch a single user by ID
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getUserById = (id) => apiGet(`${ENDPOINT}/${id}`);
