import axios from 'axios';
import { Task, TaskStats, User, CreateTaskData, UpdateTaskData, TaskStatus, TaskPriority } from '../types';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Changed from 'token' to 'accessToken'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            // Fix: Send refresh token in Authorization header, not body
            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
              headers: { Authorization: `Bearer ${refreshToken}` }
            });
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            localStorage.setItem('accessToken', accessToken); // Changed from 'token'
            localStorage.setItem('refreshToken', newRefreshToken);
            error.config.headers.Authorization = `Bearer ${accessToken}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          localStorage.removeItem('accessToken'); // Changed from 'token'
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    console.log('API: Sending login request with:', { usernameOrEmail: email });
    const response = await api.post('/api/auth/login', {
      usernameOrEmail: email,
      password
    });
    console.log('API: Login response received:', response.data);
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    console.log('API: Sending register request with:', { name, email });

    // Fix: Split name into firstName and lastName
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || firstName; // fallback if no last name

    const response = await api.post('/api/auth/register', {
      username: email.split('@')[0], // Generate username from email
      email,
      password,
      firstName,
      lastName
    });
    console.log('API: Register response received:', response.data);
    return response.data;
  },
  refresh: async (refreshToken: string) => {
    const response = await api.post('/api/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
    return response.data;
  },
};

// User API
export const userAPI = {
  getMe: async (): Promise<User> => {
    console.log('API: Getting user profile');
    const response = await api.get('/api/users/me');
    console.log('API: User profile received:', response.data);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks');
    return response.data;
  },
  createTask: async (task: CreateTaskData): Promise<Task> => {
    const response = await api.post('/api/tasks', task);
    return response.data;
  },
  updateTask: async (id: string, task: UpdateTaskData): Promise<Task> => {
    const response = await api.put(`/api/tasks/${id}`, task);
    return response.data;
  },
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },
  completeTask: async (id: string): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${id}/complete`);
    return response.data;
  },
  setInProgress: async (id: string): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${id}/progress`);
    return response.data;
  },
  getStatistics: async (): Promise<TaskStats> => {
    const response = await api.get('/api/tasks/statistics');
    return response.data;
  },
  getTasksByStatus: async (status: TaskStatus): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/status/${status}`);
    return response.data;
  },
  getTasksByPriority: async (priority: TaskPriority): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/priority/${priority}`);
    return response.data;
  },
  searchTasks: async (title: string): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/search?title=${encodeURIComponent(title)}`);
    return response.data;
  },
  getOverdueTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks/overdue');
    return response.data;
  },
};