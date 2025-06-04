import { AxiosError } from 'axios';
import api from './api';
import { IApiError, IApiResponse } from '@/models/api';
import { IUser } from '@/models/user';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  identityNumber?: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

class AuthService {
  async login(data: LoginData): Promise<IUser> {
    try {
      const response = await api.post<IApiResponse<TokenResponse>>('/auth/login', data);
      const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('accessTokenExpiresIn', expires_in.toString());
      localStorage.setItem('refreshExpiresIn', refresh_expires_in.toString());
      
      return this.getMe();
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async register(data: RegisterData): Promise<IUser> {
    try {
      const response = await api.post<IApiResponse<TokenResponse>>('/auth/register', data);
      const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('accessTokenExpiresIn', expires_in.toString());
      localStorage.setItem('refreshExpiresIn', refresh_expires_in.toString());
      
      return this.getMe();
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async refreshAuthToken(): Promise<TokenResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<IApiResponse<TokenResponse>>('/auth/refresh', {
        refresh_token: refreshToken
      });

      const { access_token, refresh_token, expires_in, refresh_expires_in } = response.data.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('accessTokenExpiresIn', expires_in.toString());
      localStorage.setItem('refreshExpiresIn', refresh_expires_in.toString());

      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async getMe(): Promise<IUser> {
    try {
      const response = await api.get<IApiResponse<IUser>>('/auth/me');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiresIn');
    localStorage.removeItem('refreshExpiresIn');
  }

  private handleError(error: AxiosError<IApiError>): Error {
    const message = error.response?.data?.message ?? error.message ?? 'An error occurred';
    return new Error(message);
  }
}

export const authService = new AuthService(); 