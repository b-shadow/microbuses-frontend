import { api } from '../../../shared/services/api'

type OfflinePackage = { id: string; version: string; status: string; file_url?: string | null }

export async function getLatestPackage() {
  return api.get<OfflinePackage>('/offline-packages/latest')
}

export async function generatePackage(version: string) {
  return api.post<{ id: string }>(`/offline-packages/generate?version=${encodeURIComponent(version)}`)
}

export async function publishPackage(id: string) {
  return api.post(`/offline-packages/${id}/publish`)
}
