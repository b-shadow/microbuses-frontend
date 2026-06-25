import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getBus } from '../services/module.service'

type Bus = { id: string; plate: string; model: string; seats_count: number; internal_number: string; line_id: string | number; status: string }

export function BusesDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<Bus | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getBus(id)
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
      <h1 className='text-xl font-semibold'>Detalle microbus</h1>
      <div className='mt-3 space-y-2 rounded border p-3 dark:border-slate-700'>
        <p><strong>Placa:</strong> {row.plate}</p>
        <p><strong>Modelo:</strong> {row.model}</p>
        <p><strong>Asientos:</strong> {row.seats_count}</p>
        <p><strong>Numero interno:</strong> {row.internal_number}</p>
        <p><strong>Linea:</strong> {row.line_id}</p>
        <p><strong>Estado:</strong> {row.status}</p>
      </div>
      <div className='mt-3'>
        <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/buses/${row.id}/edit`}>Editar</Link>
      </div>
    </section>
  )
}
