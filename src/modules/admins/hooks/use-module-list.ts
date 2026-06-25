import { useEffect, useState } from 'react'

import { AdminRow, listAdmins } from '../services/module.service'

export function useModuleList() {
  const [rows, setRows] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reload = async () => {
    setLoading(true)
    setError('')
    const res = await listAdmins()
    if (!res.success) {
      setError(res.message || 'No se pudo cargar administradores')
      setLoading(false)
      return
    }
    setRows(res.data)
    setLoading(false)
  }

  useEffect(() => {
    void reload()
  }, [])

  return { rows, loading, error, reload }
}
