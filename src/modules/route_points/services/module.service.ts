import { api } from '../../../shared/services/api'

type RoutePointRow = {
  id: string | number
  id_linea_punto?: number
  id_linea_ruta?: number
  id_punto?: number
  id_punto_dest?: number
  orden?: number
  distancia?: number | null
  tiempo?: number | null
}
type RouteLite = { id: string | number; id_linea_ruta?: number; id_linea?: number; descripcion?: string }

export async function listRoutePoints() {
  return api.get<RoutePointRow[]>('/lineas-puntos')
}

export async function listRoutesLite() {
  return api.get<RouteLite[]>('/linea-ruta')
}

export async function createRoutePoint(payload: {
  id_linea_ruta?: number
  orden?: number
  id_punto?: number
  id_punto_dest?: number
  distancia?: number | null
  tiempo?: number | null
}) {
  return api.post<RoutePointRow>('/lineas-puntos', payload)
}

export async function updateRoutePoint(
  pointId: string,
  payload: Partial<{ orden: number; id_punto: number; id_punto_dest: number; distancia: number | null; tiempo: number | null }>,
) {
  return api.patch<RoutePointRow>(`/lineas-puntos/${pointId}`, payload)
}

export async function deleteRoutePoint(pointId: string) {
  return api.delete(`/lineas-puntos/${pointId}`)
}
