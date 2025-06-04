import { ServiceResultInterface } from '@/types/service-result-types';
type ExtractDataType<T> = T extends { data: infer D } ? D : T

class ServiceResult<T> implements ServiceResultInterface<T> {
  data: T extends { data: any } ? T['data'] : T | null
  httpStatusCode: number;
  statusCode: number;
  message: string | null;
  errors: string[] | null;
  dateTime: string | null;
  limit: number;
  offset: number | null;
  totalRowCount: number | null;
  totalPageCount: number | null;

  constructor({
    data = null as T extends { data: any } ? T['data'] : T | null,
    httpStatusCode = 100,
    statusCode = 100,
    message = null,
    errors = null,
    dateTime = null,
    limit = 10,
    offset = null,
    totalRowCount = null,
    totalPageCount = null,
  }: Partial<ServiceResultInterface<T>> = {}) {
    this.data = data;
    this.httpStatusCode = httpStatusCode;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.dateTime = dateTime;
    this.limit = limit;
    this.offset = offset;
    this.totalRowCount = totalRowCount;
    this.totalPageCount = totalPageCount;
  }

  static fromJson<T>(
    json: Record<string, unknown>,
    create: (data: unknown) => T,
  ): ServiceResult<T> {
    const data = json?.data != null ? create(json?.data) : (null as ExtractDataType<T>);

    return new ServiceResult<T>({
      data: data as T extends { data: any } ? T['data'] : T | null,
      httpStatusCode: typeof json.httpStatusCode === 'number' ? json.httpStatusCode : 100,
      statusCode: typeof json.statusCode === 'number' ? json.statusCode : 100,
      message: typeof json.message === 'string' ? json.message : null,
      dateTime: typeof json.dateTime === 'string' ? json.dateTime : null,
      totalRowCount: typeof json.totalRowCount === 'number' ? json.totalRowCount : null,
      totalPageCount: typeof json.totalPageCount === 'number' ? json.totalPageCount : null,
      offset: typeof json.offset === 'number' ? json.offset : null,
      limit: typeof json.limit === 'number' ? json.limit : 10,
      errors: Array.isArray(json.errors) ? (json.errors as string[]) : null,
    });
  }

  static fromJsonList<T>(json: Record<string, unknown>, data: T[]): ServiceResult<T[]> {
    return new ServiceResult<T[]>({
      data,
      httpStatusCode: typeof json.httpStatusCode === 'number' ? json.httpStatusCode : 100,
      statusCode: typeof json.statusCode === 'number' ? json.statusCode : 100,
      message: typeof json.message === 'string' ? json.message : null,
      dateTime: typeof json.dateTime === 'string' ? json.dateTime : null,
      totalRowCount: typeof json.totalRowCount === 'number' ? json.totalRowCount : null,
      totalPageCount: typeof json.totalPageCount === 'number' ? json.totalPageCount : null,
      offset: typeof json.offset === 'number' ? json.offset : null,
      limit: typeof json.limit === 'number' ? json.limit : 10,
      errors: Array.isArray(json.errors) ? (json.errors as string[]) : null,
    });
  }
}

export { ServiceResult };
