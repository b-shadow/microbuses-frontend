import { api } from '../../../shared/services/api'

type BusRow = {
  id: string
  plate: string
  model: string
  seats_count: number
  internal_number: string
  line_id: string | number
  status: string
}

type LineRow = { id: string | number; id_linea?: number; nombre_linea?: string; color_linea?: string }

export async function listBuses() {
  return api.get<BusRow[]>('/buses')
}

export async function getBus(busId: string) {
  return api.get<BusRow>(`/buses/${busId}`)
}

export async function listLines() {
  return api.get<LineRow[]>('/lineas')
}

export async function createBus(payload: {
  plate: string
  model: string
  seats_count: number
  internal_number: string
  current_line_id: string | number
}) {
  return api.post<BusRow>('/buses', payload)
}

export async function changeBusLine(busId: string, lineId: string | number) {
  return api.post<BusRow>(`/buses/${busId}/change-line`, { line_id: lineId })
}

export async function updateBus(busId: string, payload: Partial<Pick<BusRow, 'plate' | 'model' | 'seats_count' | 'internal_number' | 'status'>>) {
  return api.patch<BusRow>(`/buses/${busId}`, payload)
}
