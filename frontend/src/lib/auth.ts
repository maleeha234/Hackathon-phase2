const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public detail?: string
  ) {
    super(message);
    this.name = 'AuthError';
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

    throw new AuthError(
      `Auth Error: ${response.status}`,
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

// Token storage helpers
function setToken(token: string) {
  localStorage.setItem('auth_token', token);
}

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function clearToken() {
  localStorage.removeItem('auth_token');
}

export const authApi = {
  // Sign in
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse<AuthResponse>(response);
    setToken(data.access_token);
    return data;
  },

  // Sign up
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse<AuthResponse>(response);
    setToken(data.access_token);
    return data;
  },

  // Sign out
  async signOut(): Promise<void> {
    clearToken();
  },

  // Get current token
  getToken(): string | null {
    return getToken();
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return getToken() !== null;
  },
};

export { AuthError };
