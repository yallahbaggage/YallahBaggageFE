import { IBaseUser } from './base'

export interface ICustomer extends IBaseUser {
  role: 'customer';
  address?: string;
} 