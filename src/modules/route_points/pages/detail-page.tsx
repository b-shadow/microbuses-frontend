import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { listRoutePoints } from '../services/module.service'

type RoutePoint = {
  id: string | number
  id_linea_punto?: number
  route_id?: string
  id_linea_ruta?: number
  id_punto?: number
  id_punto_dest?: number
  sequence?: number
  orden?: number
  lat?: number | null
  lng?: number | null
}

export function RoutePointsDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<RoutePoint | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await listRoutePoints()
      if (!res.success) {
        setMessage(res.message)
        return
      }
      setRow(res.data.find((x) => String(x.id) === id) ?? null)
      if (!res.data.find((x) => String(x.id) === id)) setMessage('Punto no encontrado')
    }
    void load()
  }, [id])

  if (!row) return <p>{message || 'Cargando...'}</p>

  return (
    <section>
      <h1 className='text-xl font-semibold'>Detalle punto de linea ruta</h1>
      <div className='mt-3 space-y-2 rounded border p-3 dark:border-slate-700'>
        <p><strong>ID:</strong> {row.id_linea_punto ?? row.id}</p>
        <p><strong>Linea ruta:</strong> {row.id_linea_ruta ?? row.route_id}</p>
        <p><strong>Punto:</strong> {row.id_punto ?? '-'}</p>
        <p><strong>Destino:</strong> {row.id_punto_dest ?? '-'}</p>
        <p><strong>Orden:</strong> {row.orden ?? row.sequence}</p>
        <p><strong>Lat:</strong> {row.lat ?? '-'}</p>
        <p><strong>Lng:</strong> {row.lng ?? '-'}</p>
      </div>
      <div className='mt-3'>
        <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/lineas-puntos/${row.id}/edit`}>Editar</Link>
      </div>
    </section>
  )
}
