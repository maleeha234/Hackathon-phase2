import { Task, TaskFormData } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: {
    detail: string;
  };
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    let errorDetail: string;

    try {
      const error = JSON.parse(text);
      errorDetail = error.detail || error.message || response.statusText;
    } catch {
      errorDetail = text || response.statusText;
    }

    throw new ApiError(
      `API Error: ${response.status}`,
      response.status,
      errorDetail
    );
  }

  try {
    return text ? JSON.parse(text) : ({} as T);
  } catch {
    return {} as T;
  }
}

function getAuthHeader(): Record<string, string> {
  // Get token from localStorage
  const token = localStorage.getItem('auth_token');

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  return {};
}

// Task API
export const taskApi = {
  // Get all tasks
  async list(filter?: { completed?: boolean }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filter?.completed !== undefined) {
      params.append('completed', filter.completed.toString());
    }

    const response = await fetch(`${API_BASE_URL}/api/tasks?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    return handleResponse<Task[]>(response);
  },

  // Get single task
  async get(taskId: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    return handleResponse<Task>(response);
  },

  // Create task
  async create(data: TaskFormData): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
    });

    return handleResponse<Task>(response);
  },

  // Update task
  async update(taskId: string, data: Partial<TaskFormData>): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
    });

    return handleResponse<Task>(response);
  },

  // Delete task
  async delete(taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    await handleResponse<void>(response);
  },

  // Toggle task completion
  async toggleComplete(taskId: string, completed: boolean): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ completed }),
    });

    return handleResponse<Task>(response);
  },
};

// Health check
export const apiHealthCheck = async (): Promise<{ status: string }> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse<{ status: string }>(response);
};

export { ApiError };
