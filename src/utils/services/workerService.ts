import { AxiosError } from 'axios';
import api from './api';
import { IApiError, IApiResponse } from '@/models/api';
import { IWorker, IWorkersStats } from '@/models/worker'; // Corrected import from Worker to IWorker

class WorkerService {
  async getWorkers(params?: { page?: number; limit?: number }): Promise<any> {
    try {
      const response = await api.get('/workers', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async getWorker(workerId: string): Promise<IWorker> {
    try {
      const response = await api.get<IApiResponse<IWorker>>(`/workers/${workerId}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async getWorkersStats(): Promise<IWorkersStats> {
    try {
      const response = await api.get('/workers/stats');
      return response.data as IWorkersStats;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  async deleteWorker(workerId: string): Promise<void> {
    try {
      await api.delete(`/workers/${workerId}`);
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    } 
  }

  async createWorker(worker: IWorker): Promise<IWorker> {
    try {
      const response = await api.post('/workers', worker);
      return response.data as IWorker;
    } catch (error) {
      throw this.handleError(error as AxiosError<IApiError>);
    }
  }

  private handleError(error: AxiosError<IApiError>): Error {
    const message = error.response?.data?.message ?? error.message ?? 'An error occurred';
    return new Error(message);
  }
}

export const workerService = new WorkerService(); 