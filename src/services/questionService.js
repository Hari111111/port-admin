import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

const ENDPOINT = '/questions';

export const getAllQuestions = async (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key]) {
      query.append(key, params[key]);
    }
  });
  
  const queryString = query.toString();
  const url = queryString ? `${ENDPOINT}?${queryString}` : ENDPOINT;
  const response = await apiGet(url);
  return response; // we now return the whole response object for pagination metadata
};

export const getQuestionById = async (id) => {
  const response = await apiGet(`${ENDPOINT}/${id}`);
  return response.data;
};

export const createQuestion = async (data) => {
  const response = await apiPost(ENDPOINT, data);
  return response.data;
};

export const generateQuestionDraft = async (data) => {
  const response = await apiPost('/ai/question', data);
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
