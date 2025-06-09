import { IBaseUser } from './base'

export interface IAdmin extends IBaseUser {
  role: 'admin';
} 