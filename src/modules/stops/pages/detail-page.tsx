import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getStop } from '../services/module.service'

type StopRow = {
  id: string | number
  id_punto?: number
  name?: string
  descripcion?: string
  route_id?: string | null
  latitud?: number
  longitud?: number
  is_active: boolean
}

export function StopsDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<StopRow | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getStop(id)
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
      <h1 className='text-xl font-semibold'>Detalle punto</h1>
      <div className='mt-3 space-y-2 rounded border p-3 dark:border-slate-700'>
        <p><strong>ID:</strong> {row.id_punto ?? row.id}</p>
        <p><strong>Descripcion:</strong> {row.descripcion ?? row.name}</p>
        <p><strong>Ruta:</strong> {row.route_id ?? 'Sin ruta'}</p>
        <p><strong>Latitud:</strong> {row.latitud ?? '-'}</p>
        <p><strong>Longitud:</strong> {row.longitud ?? '-'}</p>
        <p><strong>Activa:</strong> {row.is_active ? 'Si' : 'No'}</p>
      </div>
      <div className='mt-3'>
        <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/puntos/${row.id}/edit`}>Editar</Link>
      </div>
    </section>
  )
}
