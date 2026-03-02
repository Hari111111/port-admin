/**
 * Profile Service
 * All API calls related to /api/profile
 */

import { apiGet, apiPut } from '@/lib/api';

const ENDPOINT = '/profile';

/**
 * Fetch the portfolio owner's profile
 * @returns {Promise<object>}
 */
export const getProfile = () => apiGet(ENDPOINT);

/**
 * Update the portfolio owner's profile
 * @param {object} profileData
 * @returns {Promise<object>}
 */
export const updateProfile = (profileData) => apiPut(ENDPOINT, profileData);
