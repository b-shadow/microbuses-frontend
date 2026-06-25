import { api } from '../../../shared/services/api'

type Trip = { id: string; driver_id: string; bus_id: string; line_id: string; status: string }

export async function listTripsHistory() {
  return api.get<Trip[]>('/active-trips/history')
}
