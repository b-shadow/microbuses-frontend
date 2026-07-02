import { api } from '../../../shared/services/api'

export type DashboardCounts = {
  drivers: number
  buses: number
  lineas: number
  rutas: number
  stops: number
  users: number
  assignments: number
  active_trips: number
}

export type DriverStatus = {
  pending: number
  approved: number
  rejected: number
}

export type BusStatus = {
  active: number
  inactive: number
}

export type RecentDriver = {
  id: string
  full_name: string
  email: string
  approval_status: string
  created_at: string | null
}

export type RecentLine = {
  id: number
  nombre: string
  color: string
  created_at: string | null
}

export type DashboardData = {
  counts: DashboardCounts
  driver_status: DriverStatus
  bus_status: BusStatus
  recent_drivers: RecentDriver[]
  recent_lines: RecentLine[]
}

export async function getAdminDashboard() {
  return api.get<DashboardData>('/dashboard/admin')
}
