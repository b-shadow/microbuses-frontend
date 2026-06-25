import { api } from '../../../shared/services/api'

export type AdminRow = {
  id: string
  email: string
  full_name: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  is_active: boolean
  created_at?: string | null
}

export async function listAdmins() {
  return api.get<AdminRow[]>('/admins')
}

export async function createAdmin(payload: { email: string; password: string; full_name: string; role: 'ADMIN' | 'SUPER_ADMIN' }) {
  return api.post<AdminRow>('/admins', payload)
}

export async function updateAdmin(adminId: string, payload: Partial<Pick<AdminRow, 'full_name' | 'role' | 'is_active'>>) {
  return api.patch<AdminRow>(`/admins/${adminId}`, payload)
}

export async function activateAdmin(adminId: string) {
  return api.patch<AdminRow>(`/admins/${adminId}/activate`)
}

export async function deactivateAdmin(adminId: string) {
  return api.patch<AdminRow>(`/admins/${adminId}/deactivate`)
}
