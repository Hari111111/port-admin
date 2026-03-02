/**
 * Project Service
 * All API calls related to /api/projects
 */

import { apiGet, apiPost, apiDelete } from '@/lib/api';

const ENDPOINT = '/projects';

/**
 * Fetch all projects
 * @returns {Promise<Array>}
 */
export const getAllProjects = () => apiGet(ENDPOINT);

/**
 * Fetch a single project by ID
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getProjectById = (id) => apiGet(`${ENDPOINT}/${id}`);

/**
 * Create a new project
 * @param {{ title: string, image: string, description: string, technologies: string[], liveUrl: string, githubUrl: string, featured: boolean }} projectData
 * @returns {Promise<object>}
 */
export const createProject = (projectData) => apiPost(ENDPOINT, projectData);

/**
 * Delete a project by ID
 * @param {string} id
 * @returns {Promise<any>}
 */
export const deleteProject = (id) => apiDelete(`${ENDPOINT}/${id}`);
