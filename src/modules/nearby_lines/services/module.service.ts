import { api } from '../../../shared/services/api'

export type NearbyLine = { id: string | number; id_linea?: number; code?: string; name?: string; nombre_linea?: string; color?: string; color_linea?: string }

export async function searchNearbyLines(lat: number, lng: number, radiusM = 300) {
  return api.post<NearbyLine[]>('/nearby-lines/search', { lat, lng, radius_m: radiusM })
}
