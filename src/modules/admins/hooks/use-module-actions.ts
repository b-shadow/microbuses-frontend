import { activateAdmin, createAdmin, deactivateAdmin, updateAdmin } from '../services/module.service'

export function useModuleActions(onDone: () => Promise<void>) {
  const create = async (payload: { email: string; password: string; full_name: string; role: 'ADMIN' | 'SUPER_ADMIN' }) => {
    const res = await createAdmin(payload)
    if (res.success) await onDone()
    return res
  }

  const toggleActive = async (adminId: string, isActive: boolean) => {
    const res = isActive ? await deactivateAdmin(adminId) : await activateAdmin(adminId)
    if (res.success) await onDone()
    return res
  }

  const update = async (adminId: string, payload: { full_name?: string; role?: 'ADMIN' | 'SUPER_ADMIN' }) => {
    const res = await updateAdmin(adminId, payload)
    if (res.success) await onDone()
    return res
  }

  return { create, toggleActive, update }
}
