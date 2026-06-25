import { api } from '../../../shared/services/api'

export type DashboardData = {
  drivers: number
  buses: number
  lineas: number
  linea_ruta: number
  pending_drivers: number
}

export async function getAdminDashboard() {
  return api.get<DashboardData>('/dashboard/admin')
}
