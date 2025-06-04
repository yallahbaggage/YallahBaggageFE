import { error } from 'console'

export interface AuthStateInterface {
  isAuthenticated: boolean
  access_token: string | null
}

export interface AuthTokenInterface {
  access_token: string
  refresh_token: string
  id_token: string
  expires_in: number
  refresh_expires_in: number
}

export interface AuthUserInterface {
  access_token: string
  refresh_token: string
  id_Ttoken: string
  access_token_expire_date: datetime
  refresh_token_expire_date: datetime
  user: UserStateInterface
}

export function defaultAuthState(): AuthStateInterface {
  return {
    isAuthenticated: false,
    access_token: null,
  }
}
