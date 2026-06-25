import { api } from '../../../shared/services/api'

export type StopRow = {
  id: string | number
  id_punto?: number
  descripcion?: string
  stop?: string
  latitud?: number
  longitud?: number
  is_active: boolean
}
export type RouteLite = { id: string | number; id_linea_ruta?: number; id_linea?: number; descripcion?: string }

export async function listStops() {
  return api.get<StopRow[]>('/puntos')
}

export async function getStop(stopId: string) {
  return api.get<StopRow>(`/puntos/${stopId}`)
}

export async function listRoutesLite() {
  return api.get<RouteLite[]>('/linea-ruta')
}

export async function createStop(payload: { descripcion?: string; latitud?: number; longitud?: number; stop?: string }) {
  return api.post<StopRow>('/puntos', payload)
}

export async function updateStop(
  stopId: string,
  payload: Partial<{ descripcion: string; is_active: boolean; latitud: number; longitud: number; stop: string }>,
) {
  return api.patch<StopRow>(`/puntos/${stopId}`, payload)
}

export async function deactivateStop(stopId: string) {
  return api.delete(`/puntos/${stopId}`)
}
