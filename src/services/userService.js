/**
 * User Service
 * All API calls related to /api/users
 */

import { apiGet } from '@/lib/api';

const ENDPOINT = '/users';

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
