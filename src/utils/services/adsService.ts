import { AxiosError } from 'axios';
import api from './api';
import { IApiError, IApiResponse } from '@/models/api';
import { IAd } from '@/models/ad';

class AdsService {
  async getAds(params?: { page?: number; limit?: number }): Promise<any> {
    try {
      const response = await api.get('/ads/getAllAds', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async getAd(adId: string): Promise<IAd> {
    try {
      const response = await api.get<IApiResponse<IAd>>(`/ads/${adId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async createAd(adData: Partial<IAd>): Promise<IAd> {
    try {
      const response = await api.post<IApiResponse<IAd>>('/ads', adData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async updateAd(adId: string, adData: Partial<IAd>): Promise<IAd> {
    try {
      const response = await api.put<IApiResponse<IAd>>(`/ads/${adId}`, adData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async deleteAd(adId: string): Promise<void> {
    try {
      await api.delete(`/ads/${adId}`);
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async getAdsStats(): Promise<any> {
    try {
      const response = await api.get('/ads/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  private handleError(error: AxiosError<IApiError>): Error {
    const message = error.response?.data?.message ?? error.message ?? 'An error occurred';
    return new Error(message);
  }
}

export const adsService = new AdsService();
