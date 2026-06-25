import { api } from '../../../shared/services/api'

type AssignmentRow = {
  id: string
  bus_id: string
  driver_id: string
  is_active: boolean
  assigned_at?: string | null
}

type BusRow = { id: string; plate: string }
type DriverRow = { id: string; full_name: string; approval_status: string }

export async function listAssignments() {
  return api.get<AssignmentRow[]>('/bus-assignments')
}

export async function createAssignment(busId: string, driverId: string) {
  return api.post<AssignmentRow>('/bus-assignments', { bus_id: busId, driver_id: driverId })
}

export async function removeAssignment(busId: string, driverId: string) {
  return api.delete('/bus-assignments', { bus_id: busId, driver_id: driverId })
}

export async function listBusesLite() {
  return api.get<BusRow[]>('/buses')
}

export async function listDriversLite() {
  return api.get<DriverRow[]>('/drivers?approval_status=APPROVED')
}
