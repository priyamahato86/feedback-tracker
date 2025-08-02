import axios from 'axios';
import { Feedback } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const feedbackAPI = {
  getAll: () => api.get<Feedback[]>('/feedback'),
  create: (feedback: Omit<Feedback, 'id' | 'status' | 'createdAt'>) => 
    api.post<Feedback>('/feedback', feedback),
  update: (id: string, status: Feedback['status']) => 
    api.put<Feedback>(`/feedback/${id}`, { status }),
  delete: (id: string) => api.delete(`/feedback/${id}`),
};

export const chatAPI = {
  sendMessage: (message: string) => 
    api.post<{ response: string }>('/chat', {message }),
};