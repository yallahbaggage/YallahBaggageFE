export interface IApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface IApiError {
  message: string
  code?: string
  status?: number
} 