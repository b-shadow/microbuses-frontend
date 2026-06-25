import { api } from '../../../shared/services/api'

type RouteRow = {
  id: string | number
  id_linea_ruta?: number
  id_linea?: number
  id_ruta?: number
  distancia?: number | null
  tiempo?: number | null
  descripcion?: string
  is_active: boolean
}

type LineRow = { id: string | number; id_linea?: number; nombre_linea?: string; color_linea?: string }

export async function listRoutes() {
  return api.get<RouteRow[]>('/linea-ruta')
}

export async function getRoute(routeId: string) {
  return api.get<RouteRow>(`/linea-ruta/${routeId}`)
}

export async function listLinesLite() {
  return api.get<LineRow[]>('/lineas')
}

export async function createRoute(payload: {
  id_linea?: number
  id_ruta?: number
  descripcion?: string
  distancia?: number | null
  tiempo?: number | null
}) {
  return api.post<RouteRow>('/linea-ruta', payload)
}

export async function deactivateRoute(routeId: string) {
  return api.delete(`/linea-ruta/${routeId}`)
}

export async function updateRoute(
  routeId: string,
  payload: Partial<Pick<RouteRow, 'is_active' | 'descripcion' | 'distancia' | 'tiempo'>>,
) {
  return api.patch<RouteRow>(`/linea-ruta/${routeId}`, payload)
}
