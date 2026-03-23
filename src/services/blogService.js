/**
 * Blog Service
 * All API calls related to /api/blogs
 */

import { apiGet, apiPost, apiDelete, apiPut } from '@/lib/api';

const ENDPOINT = '/blogs';

/**
 * Fetch all blog posts
 * @returns {Promise<Array>}
 */
export const getAllBlogs = () => apiGet(ENDPOINT);

/**
 * Fetch a single blog post by ID
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getBlogById = (id) => apiGet(`${ENDPOINT}/${id}`);

/**
 * Create a new blog post
 * @param {{ title: string, slug: string, image: string, category: string, description: string, content: string, tags: string[] }} blogData
 * @returns {Promise<object>}
 */
export const createBlog = (blogData) => apiPost(ENDPOINT, blogData);

/**
 * Update an existing blog post
 * @param {string} id
 * @param {object} blogData
 * @returns {Promise<object>}
 */
export const updateBlog = (id, blogData) => apiPut(`${ENDPOINT}/${id}`, blogData);

/**
 * Generate an AI draft for a blog post
 * @param {{ topic: string, category?: string, audience?: string, tone?: string, keywords?: string }} payload
 * @returns {Promise<object>}
 */
export const generateBlogDraft = (payload) => apiPost('/ai/blog', payload);

/**
 * Delete a blog post by ID
 * @param {string} id
 * @returns {Promise<any>}
 */
export const deleteBlog = (id) => apiDelete(`${ENDPOINT}/${id}`);
