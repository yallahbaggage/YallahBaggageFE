export interface IUser {
  _id: string
  name: string
  email: string
  role: 'customer' | 'admin' | 'worker'
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IRegisterData {
  name: string
  email: string
  password: string
  phone?: string
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
} 