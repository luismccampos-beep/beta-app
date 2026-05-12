import {
  AuthError,
  AuthResponse,
  ChangePasswordData,
  ConfirmResetPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  UpdateProfileData,
} from '../../contexts/auth/auth-types';
import { User } from '../../types';
import { getEnv } from '../../utils/env';

export class AuthService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getEnv('NEXT_PUBLIC_API_URL') || 'http://localhost:3001/api';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = this.getStoredToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        
        throw {
          message,
          code: errorData.code || 'API_ERROR',
          status: response.status,
          ...errorData,
        } as AuthError;
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          status: 0,
        } as AuthError;
      }
      
      throw error as AuthError;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      this.clearStoredAuthData();
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await this.makeRequest<{ accessToken: string; expiresIn: number }>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }
    );

    this.setStoredToken(response.accessToken);
    return response.accessToken;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.makeRequest('/auth/validate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.makeRequest<User>('/auth/me');
  }

  async updateProfile(updates: UpdateProfileData): Promise<User> {
    return this.makeRequest<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    await this.makeRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async confirmResetPassword(data: ConfirmResetPasswordData): Promise<void> {
    await this.makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string): Promise<void> {
    await this.makeRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async deleteAccount(password?: string): Promise<void> {
    await this.makeRequest('/auth/account', {
      method: 'DELETE',
      body: password ? JSON.stringify({ password }) : null,
    });
    this.clearStoredAuthData();
  }

  async checkSession(): Promise<boolean> {
    try {
      await this.makeRequest('/auth/session');
      return true;
    } catch {
      return false;
    }
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem('auth_access_token');
    } catch {
      return null;
    }
  }

  private setStoredToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('auth_access_token', token);
    } catch {
    }
  }

  private clearStoredAuthData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem('auth_access_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_expires_at');
    } catch {
    }
  }

  persistAuthData(response: AuthResponse): void {
    if (response.token) {
      this.setStoredToken(response.token);
    }
    
    if (response.refreshToken && typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_refresh_token', response.refreshToken);
      } catch {
      }
    }
    
    if (response.user && typeof window !== 'undefined') {
      try {
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      } catch {
      }
    }
    
    if (response.expiresIn && typeof window !== 'undefined') {
      try {
        const expiresAt = Date.now() + (response.expiresIn * 1000);
        localStorage.setItem('auth_expires_at', expiresAt.toString());
      } catch {
      }
    }
  }

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('auth_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getStoredRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem('auth_refresh_token');
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    try {
      const expiresAt = localStorage.getItem('auth_expires_at');
      return expiresAt ? Date.now() > parseInt(expiresAt, 10) : true;
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();
