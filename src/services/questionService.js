import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

const ENDPOINT = '/questions';

export const getAllQuestions = async (category = '') => {
  const url = category ? `${ENDPOINT}?category=${category}` : ENDPOINT;
  const response = await apiGet(url);
  return response.data;
};

export const getQuestionById = async (id) => {
  const response = await apiGet(`${ENDPOINT}/${id}`);
  return response.data;
};

export const createQuestion = async (data) => {
  const response = await apiPost(ENDPOINT, data);
  return response.data;
};

export const updateQuestion = async (id, data) => {
  const response = await apiPut(`${ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await apiDelete(`${ENDPOINT}/${id}`);
  return response.data;
};
