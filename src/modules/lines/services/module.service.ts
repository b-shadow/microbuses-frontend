import { api } from '../../../shared/services/api'

export type LineRow = {
  id: string | number
  id_linea?: number
  nombre_linea?: string
  color_linea?: string
  imagen_micro?: string | null
  is_active: boolean
}

export async function listLines() {
  return api.get<LineRow[]>('/lineas')
}

export async function getLine(lineId: string) {
  return api.get<LineRow>(`/lineas/${lineId}`)
}

export async function createLine(payload: {
  nombre_linea?: string
  color_linea?: string
  imagen_micro?: string | null
}) {
  return api.post<LineRow>('/lineas', payload)
}

export async function updateLine(
  lineId: string,
  payload: Partial<Pick<LineRow, 'nombre_linea' | 'color_linea' | 'imagen_micro' | 'is_active'>>,
) {
  return api.patch<LineRow>(`/lineas/${lineId}`, payload)
}

export async function deleteLine(lineId: string) {
  return api.delete(`/lineas/${lineId}`)
}
