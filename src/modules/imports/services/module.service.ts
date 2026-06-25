import { api } from '../../../shared/services/api'

type ImportRow = { id: string; status: string; total_rows: number; valid_rows: number; invalid_rows: number }

export async function createImport(fileName: string) {
  return api.post<{ id: string }>(`/imports/lineas/excel?file_name=${encodeURIComponent(fileName)}`)
}

export async function getImport(id: string) {
  return api.get<ImportRow>(`/imports/${id}`)
}

export async function confirmImport(id: string) {
  return api.post(`/imports/${id}/confirm`)
}

export async function getImportErrors(id: string) {
  return api.get<{ errors: unknown[] }>(`/imports/${id}/errors`)
}
