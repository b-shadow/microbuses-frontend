import { api } from '../../../shared/services/api'

type ActiveBus = { trip_id: string; bus_id: string; driver_id: string; line_id: string }
type TrackingPoint = { id: string; active_trip_id: string; recorded_at: string; speed?: number | null }

export async function listActiveBuses() {
  return api.get<ActiveBus[]>('/tracking/active-buses')
}

export async function getBusTracking(busId: string) {
  return api.get<TrackingPoint[]>(`/tracking/bus/${busId}`)
}
