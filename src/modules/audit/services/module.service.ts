import { api } from '../../../shared/services/api'

export type AuditRow = {
  id: string
  actor_type: string
  action: string
  entity: string
  created_at: string
}

export async function listAuditLogs() {
  return api.get<AuditRow[]>('/audit')
}