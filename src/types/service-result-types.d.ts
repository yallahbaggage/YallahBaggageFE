export interface ServiceResultInterface<T = any> {
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
}

// export interface ServiceResultInterface<T = any> {
//   data: T extends { data: any } ? T['data'] : T | null
//   httpStatusCode: number
//   statusCode: number
//   message: string | null
//   errors: string[] | null
//   dateTime: string
//   limit: T extends { limit: number } ? T['limit'] : number
//   offset: T extends { offset: number } ? T['offset'] : number
//   totalRowCount: T extends { totalRowCount: number } ? T['totalRowCount'] : number
//   totalPageCount: T extends { totalPageCount: number } ? T['totalPageCount'] : number
// }
