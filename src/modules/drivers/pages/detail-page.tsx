import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { DriverRow, getDriver } from '../services/module.service'

export function DriversDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<DriverRow | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getDriver(id)
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
      <h1 className='text-xl font-semibold'>Detalle conductor</h1>
      <div className='mt-3 space-y-2 rounded border p-3 dark:border-slate-700'>
        <p><strong>Email:</strong> {row.email}</p>
        <p><strong>Nombre:</strong> {row.full_name}</p>
        <p><strong>CI:</strong> {row.ci}</p>
        <p><strong>Estado:</strong> {row.approval_status}</p>
        <p><strong>Teléfono:</strong> {row.phone}</p>
        <p><strong>Licencia:</strong> {row.license_category}</p>
      </div>
      <div className='mt-3'>
        <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/drivers/${row.id}/edit`}>Editar</Link>
      </div>
    </section>
  )
}
