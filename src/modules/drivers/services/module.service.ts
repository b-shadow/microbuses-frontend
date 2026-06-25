import { api } from '../../../shared/services/api'

export type DriverRow = {
  id: string
  email: string
  ci: string
  full_name: string
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED'
  phone: string
  license_category: string
  is_active: boolean
}

export async function listDrivers(approvalStatus?: DriverRow['approval_status']) {
  const query = approvalStatus ? `?approval_status=${approvalStatus}` : ''
  return api.get<DriverRow[]>(`/drivers${query}`)
}

export async function getDriver(driverId: string) {
  return api.get<DriverRow>(`/drivers/${driverId}`)
}

export async function createDriver(payload: {
  email: string
  password: string
  ci: string
  full_name: string
  phone: string
  license_category: string
}) {
  return api.post<DriverRow>('/drivers', payload)
}

export async function approveDriver(driverId: string, reason?: string) {
  return api.post<DriverRow>(`/drivers/${driverId}/approve`, { reason })
}

export async function rejectDriver(driverId: string, reason?: string) {
  return api.post<DriverRow>(`/drivers/${driverId}/reject`, { reason })
}

export async function updateDriver(driverId: string, payload: Partial<Pick<DriverRow, 'full_name' | 'phone' | 'license_category' | 'is_active'>>) {
  return api.patch<DriverRow>(`/drivers/${driverId}`, payload)
}
