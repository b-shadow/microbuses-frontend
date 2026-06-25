import { api } from '../../../shared/services/api'

export type LoginResponse = {
  access_token: string
  role: string
}

export async function loginAdmin(email: string, password: string) {
  return api.post<LoginResponse>('/auth/login', { email, password })
}