import { api } from '../../../shared/services/api'

export type RouteRow = { id: string | number; id_linea_ruta?: number; id_linea?: number; id_ruta?: number; descripcion?: string }
export type StopRow = { id: string | number; id_punto?: number; descripcion?: string; latitud?: number; longitud?: number }
export type NearbyLine = { id: string | number; id_linea?: number; nombre_linea?: string; color_linea?: string }

export async function listRoutes() {
  return api.get<RouteRow[]>('/linea-ruta')
}

export async function listStops() {
  return api.get<StopRow[]>('/puntos')
}

export async function searchNearbyLines(lat: number, lng: number, radiusM = 300) {
  return api.post<NearbyLine[]>('/nearby-lines/search', { lat, lng, radius_m: radiusM })
}
