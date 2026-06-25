import { api } from '../../../shared/services/api'

export type ActiveBusRow = {
  bus_id: string
  plate?: string
  line_code?: string
  line_id?: string | number
  driver_name?: string
  updated_at?: string
}

export async function listActiveBuses() {
  return api.get<ActiveBusRow[]>('/tracking/active-buses')
}
