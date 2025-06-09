import { IBaseUser } from './base'

export interface IUser extends IBaseUser {
  role: 'admin' | 'customer' | 'worker'
  // Customer specific fields
  address?: string
  createdAt: string
  updatedAt: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  identityNumber?: string
  role?: 'admin' | 'customer' | 'worker'
  specialization?: string
  address?: string
}

export interface IAuthResponse {
  user: IUser
  token: string
}

export interface IUserUpdateData {
  name?: string
  email?: string
  phone?: string
  address?: string
  password?: string
  preferredLang?: string
  region?: string
  timeFormat?: '12' | '24'
} 