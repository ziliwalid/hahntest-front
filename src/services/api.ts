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
  const token = localStorage.getItem('token');
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
          const response = await api.post('/api/auth/refresh', null, {
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            }
          });
          const { accessToken } = response.data;
          localStorage.setItem('token', accessToken);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
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
    
    // Map backend response to frontend format
    const { accessToken, refreshToken, userId, username, email: userEmail, firstName, lastName } = response.data;
    
    return {
      token: accessToken,
      refreshToken,
      user: {
        id: userId.toString(),
        email: userEmail,
        name: `${firstName} ${lastName}`.trim(),
        createdAt: new Date().toISOString() // Backend doesn't provide this in auth response
      }
    };
  },
  
  register: async (name: string, email: string, password: string) => {
    console.log('API: Sending register request with:', { name, email });
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || firstName; // Use firstName as fallback if no lastName
    
    // Generate username from email (before @ symbol)
    const username = email.split('@')[0];
    
    const response = await api.post('/api/auth/register', { 
      username,
      firstName,
      lastName,
      email, 
      password 
    });
    console.log('API: Register response received:', response.data);
    
    // Map backend response to frontend format
    const { accessToken, refreshToken, userId, email: userEmail, firstName: respFirstName, lastName: respLastName } = response.data;
    
    return {
      token: accessToken,
      refreshToken,
      user: {
        id: userId.toString(),
        email: userEmail,
        name: `${respFirstName} ${respLastName}`.trim(),
        createdAt: new Date().toISOString()
      }
    };
  },
  
  refresh: async (refreshToken: string) => {
    const response = await api.post('/api/auth/refresh', null, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    return response.data;
  },

  logout: async () => {
    await api.post('/api/auth/logout');
  }
};

// User API
export const userAPI = {
  getMe: async (): Promise<User> => {
    console.log('API: Getting user profile');
    const response = await api.get('/api/users/me');
    console.log('API: User profile received:', response.data);
    
    // Map backend UserProfileResponse to frontend User format
    const userData = response.data;
    return {
      id: userData.id.toString(),
      email: userData.email,
      name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      createdAt: userData.createdAt || new Date().toISOString()
    };
  },

  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  }
};

// Tasks API
export const tasksAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks');
    return response.data.map((task: any) => ({
      ...task,
      id: task.id.toString(),
      userId: task.userId?.toString() || '1' // Fallback for userId
    }));
  },

  getTasksPaginated: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get('/api/tasks/paginated', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get(`/api/tasks/${id}`);
    const task = response.data;
    return {
      ...task,
      id: task.id.toString(),
      userId: task.userId?.toString() || '1'
    };
  },
  
  createTask: async (task: CreateTaskData): Promise<Task> => {
    // Format the task data according to CreateTaskRequest schema
    const taskData = {
      title: task.title,
      description: task.description || undefined,
      priority: task.priority,
      status: 'PENDING', // Default status for new tasks
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : undefined // Convert to date format (YYYY-MM-DD)
    };
    
    console.log('Creating task with data:', taskData);
    const response = await api.post('/api/tasks', taskData);
    const createdTask = response.data;
    return {
      ...createdTask,
      id: createdTask.id.toString(),
      userId: createdTask.userId?.toString() || '1'
    };
  },
  
  updateTask: async (id: string, task: UpdateTaskData): Promise<Task> => {
    // Format the task data according to UpdateTaskRequest schema
    const taskData = {
      title: task.title,
      description: task.description || undefined,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : undefined // Convert to date format (YYYY-MM-DD)
    };
    
    console.log('Updating task with data:', taskData);
    const response = await api.put(`/api/tasks/${id}`, taskData);
    const updatedTask = response.data;
    return {
      ...updatedTask,
      id: updatedTask.id.toString(),
      userId: updatedTask.userId?.toString() || '1'
    };
  },
  
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },
  
  completeTask: async (id: string): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${id}/complete`);
    const completedTask = response.data;
    return {
      ...completedTask,
      id: completedTask.id.toString(),
      userId: completedTask.userId?.toString() || '1'
    };
  },
  
  setInProgress: async (id: string): Promise<Task> => {
    const response = await api.patch(`/api/tasks/${id}/progress`);
    const updatedTask = response.data;
    return {
      ...updatedTask,
      id: updatedTask.id.toString(),
      userId: updatedTask.userId?.toString() || '1'
    };
  },
  
  getStatistics: async (): Promise<TaskStats> => {
    const response = await api.get('/api/tasks/statistics');
    // The backend returns a generic object, so we need to map it to our TaskStats interface
    const stats = response.data;
    return {
      total: stats.total || 0,
      completed: stats.completed || 0,
      inProgress: stats.inProgress || stats.in_progress || 0,
      overdue: stats.overdue || 0
    };
  },
  
  getTasksByStatus: async (status: TaskStatus): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/status/${status}`);
    return response.data.map((task: any) => ({
      ...task,
      id: task.id.toString(),
      userId: task.userId?.toString() || '1'
    }));
  },
  
  getTasksByPriority: async (priority: TaskPriority): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/priority/${priority}`);
    return response.data.map((task: any) => ({
      ...task,
      id: task.id.toString(),
      userId: task.userId?.toString() || '1'
    }));
  },
  
  searchTasks: async (title: string): Promise<Task[]> => {
    const response = await api.get(`/api/tasks/search`, {
      params: { title }
    });
    return response.data.map((task: any) => ({
      ...task,
      id: task.id.toString(),
      userId: task.userId?.toString() || '1'
    }));
  },
  
  getOverdueTasks: async (): Promise<Task[]> => {
    const response = await api.get('/api/tasks/overdue');
    return response.data.map((task: any) => ({
      ...task,
      id: task.id.toString(),
      userId: task.userId?.toString() || '1'
    }));
  },
};

// Health API
export const healthAPI = {
  getHealth: async () => {
    const response = await api.get('/api/health');
    return response.data;
  }
};