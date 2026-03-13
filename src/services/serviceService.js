/**
 * Service Service
 * All API calls related to /api/services
 */

import { apiGet, apiPost, apiDelete, apiPut } from '@/lib/api';

const ENDPOINT = '/services';

/**
 * Fetch all services
 * @returns {Promise<Array>}
 */
export const getAllServices = () => apiGet(ENDPOINT);

/**
 * Fetch a single service by ID
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getServiceById = (id) => apiGet(`${ENDPOINT}/${id}`);

/**
 * Create a new service
 * @param {{ title: string, icon: string, description: string }} serviceData
 * @returns {Promise<object>}
 */
export const createService = (serviceData) => apiPost(ENDPOINT, serviceData);

/**
 * Update an existing service
 * @param {string} id
 * @param {object} serviceData
 * @returns {Promise<object>}
 */
export const updateService = (id, serviceData) => apiPut(`${ENDPOINT}/${id}`, serviceData);

/**
 * Delete a service by ID
 * @param {string} id
 * @returns {Promise<any>}
 */
export const deleteService = (id) => apiDelete(`${ENDPOINT}/${id}`);
