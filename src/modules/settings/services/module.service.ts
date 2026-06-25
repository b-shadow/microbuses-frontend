import { api } from '../../../shared/services/api'

type Setting = { id: string; key: string; value: unknown; description?: string | null }

export async function listSettings() {
  return api.get<Setting[]>('/settings')
}

export async function updateSettings(items: Array<{ key: string; value: unknown; description?: string }>) {
  return api.patch('/settings', items)
}
