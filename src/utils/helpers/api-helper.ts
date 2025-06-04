import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AuthTokenInterface } from '@/types/auth-types'
import { ServiceResult } from '@/models/ServiceResultModel'

type ApiResponse<T> = T | Error

class ApiHelper<T = any> {
  private axiosInstance
  private isAuthTokenRequest: boolean

  constructor(authenticate: boolean = true , isAuthTokenRequest: boolean = false) {
    const accessToken = authenticate ? localStorage.getItem('accessToken') : null
    this.isAuthTokenRequest = isAuthTokenRequest
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
    })
  }

  private mergeHeaders(customHeaders?: Record<string, any>) {
    return {
      ...this.axiosInstance.defaults.headers.common,
      ...customHeaders,
    }
  }

  private async handleAuthRequest(
    request: Promise<AxiosResponse<any>>,
  ): Promise<ApiResponse<AuthTokenInterface>> {
    try {
      const response = await request
      return response.data as AuthTokenInterface
    } catch (error) {
      return this.formatError<AuthTokenInterface>(error, true) //INFO Hata durumunda Error nesnesi döndür
    }
  }

  private async handleRequest(
    request: Promise<AxiosResponse<any>>,
    fromJson?: (json: unknown) => T,
  ): Promise<ApiResponse<ServiceResult<T | T[]>>> {
    try {
      const response = await request
      const data = response.data

      if (Array.isArray(data)) {
        return ServiceResult.fromJsonList<T>({ data }, fromJson ? data.map(fromJson) : data)
      } else {
        return ServiceResult.fromJson<T>(data, fromJson ? fromJson : (x) => x as T)
      }
    } catch (error) {
      return this.formatError<T>(error)
    }
  }

  private formatError<T>(error: any, isAuth: boolean = false): Error {
    if (isAuth) {
      if (error.response) {
        const errorData = error.response.data
        const errorMessage =
          errorData?.error_description ||
          'Authentication failed. Please check your credentials and try again.'
        return new Error(errorMessage)
      }
      return new Error('Network error occurred during authentication.')
    }

    if (error.response) {
      const { status, data } = error.response
      const message = data?.message || 'An error occurred'
      const errors = data?.errors || ['An error occurred']
      return new Error(`${message}: ${errors.join(', ')}`)
    } else {
      return new Error('Network Error')
    }
  }

  public async get(
    url: string,
    config?: AxiosRequestConfig,
    fromJson?: (json: unknown) => T,
  ): Promise<
    ApiResponse<T extends AuthTokenInterface ? AuthTokenInterface : ServiceResult<T | T[]>>
  > {
    const headers = this.mergeHeaders(config?.headers)
    const request = this.axiosInstance.get(url, { ...config, headers })

    if (this.isAuthTokenRequest) {
      return (await this.handleAuthRequest(request)) as any
    } else {
      return (await this.handleRequest(request, fromJson)) as any
    }
  }

  public async post(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
    fromJson?: (json: unknown) => T,
  ): Promise<
    ApiResponse<T extends AuthTokenInterface ? AuthTokenInterface : ServiceResult<T | T[]>>
  > {
    const headers = this.mergeHeaders(config?.headers)
    const request = this.axiosInstance.post(url, data, { ...config, headers })

    if (this.isAuthTokenRequest) {
      return (await this.handleAuthRequest(request)) as any
    } else {
      return (await this.handleRequest(request, fromJson)) as any
    }
  }

  public async put(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
    fromJson?: (json: unknown) => T,
  ): Promise<
    ApiResponse<T extends AuthTokenInterface ? AuthTokenInterface : ServiceResult<T | T[]>>
  > {
    const headers = this.mergeHeaders(config?.headers)
    const request = this.axiosInstance.put(url, data, { ...config, headers })

    if (this.isAuthTokenRequest) {
      return (await this.handleAuthRequest(request)) as any
    } else {
      return (await this.handleRequest(request, fromJson)) as any
    }
  }

  public async delete(
    url: string,
    config?: AxiosRequestConfig,
    fromJson?: (json: unknown) => T,
  ): Promise<
    ApiResponse<T extends AuthTokenInterface ? AuthTokenInterface : ServiceResult<T | T[]>>
  > {
    const headers = this.mergeHeaders(config?.headers)
    const request = this.axiosInstance.delete(url, { ...config, headers })

    if (this.isAuthTokenRequest) {
      return (await this.handleAuthRequest(request)) as any
    } else {
      return (await this.handleRequest(request, fromJson)) as any
    }
  }
}

export {ApiHelper}
