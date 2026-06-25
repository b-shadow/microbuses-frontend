import { api } from '../../../shared/services/api'

export type UserRow = {
  id: string
  email: string
  names?: string | null
  last_names?: string | null
  phone?: string | null
  is_active?: boolean
}

export async function listUsers() {
  return api.get<UserRow[]>('/users')
}

export async function updateUser(userId: string, payload: Partial<Pick<UserRow, 'names' | 'last_names' | 'phone'>>) {
  return api.patch<UserRow>(`/users/${userId}`, payload)
}