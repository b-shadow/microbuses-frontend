import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getRoute } from '../services/module.service'

type RouteRow = {
  id: string | number
  id_linea_ruta?: number
  id_linea?: number
  line_id?: string
  variant_id?: string | null
  direction?: string
  descripcion?: string
  distancia?: number | null
  tiempo?: number | null
  total_distance_m?: number | null
  is_active: boolean
}

export function RoutesDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<RouteRow | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getRoute(id)
      if (!res.success) {
        setMessage(res.message)
        return
      }
      setRow(res.data)
    }
    void load()
  }, [id])

  if (!row) return <p>{message || 'Cargando...'}</p>

  return (
    <section>
      <h1 className='text-xl font-semibold'>Detalle recorrido</h1>
      <div className='mt-3 space-y-2 rounded border p-3 dark:border-slate-700'>
        <p><strong>ID:</strong> {row.id_linea_ruta ?? row.id}</p>
        <p><strong>Linea:</strong> {row.id_linea ?? row.line_id ?? '-'}</p>
        <p><strong>Ruta:</strong> {row.direction ?? row.descripcion ?? '-'}</p>
        <p><strong>Descripcion:</strong> {row.descripcion ?? '-'}</p>
        <p><strong>Distancia:</strong> {row.distancia ?? row.total_distance_m ?? 0}</p>
        <p><strong>Tiempo:</strong> {row.tiempo ?? 0}</p>
        <p><strong>Activo:</strong> {row.is_active ? 'Si' : 'No'}</p>
      </div>
      <div className='mt-3'>
        <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/linea-ruta/${row.id}/edit`}>Editar</Link>
      </div>
    </section>
  )
}
