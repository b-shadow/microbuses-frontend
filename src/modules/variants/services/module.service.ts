import { api } from '../../../shared/services/api'

export type VariantRow = {
  id: string
  line_id: string
  name: string
  description?: string | null
  is_active: boolean
}

export async function listVariants() {
  return api.get<VariantRow[]>('/variants')
}

export async function getVariant(variantId: string) {
  return api.get<VariantRow>(`/variants/${variantId}`)
}

export async function createVariant(payload: {
  line_id: string
  name: string
  description?: string
}) {
  return api.post<VariantRow>('/variants', payload)
}

export async function updateVariant(
  variantId: string,
  payload: Partial<Pick<VariantRow, 'name' | 'description' | 'is_active'>>,
) {
  return api.patch<VariantRow>(`/variants/${variantId}`, payload)
}

export async function deleteVariant(variantId: string) {
  return api.delete(`/variants/${variantId}`)
}
