import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getLine, LineRow } from '../services/module.service'

export function LinesDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<LineRow | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getLine(id)
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
      <h1 className='text-xl font-semibold'>Detalle linea</h1>
      <div className='mt-3 space-y-2 rounded border p-3 dark:border-slate-700'>
        <p><strong>ID:</strong> {row.id_linea ?? row.id}</p>
        <p><strong>Nombre:</strong> {row.nombre_linea}</p>
        <p><strong>Color:</strong> <span className='inline-block h-4 w-8 rounded' style={{ backgroundColor: row.color_linea ?? '#000' }} /></p>
        <p><strong>Imagen:</strong> {row.imagen_micro ?? '-'}</p>
        <p><strong>Activa:</strong> {row.is_active ? 'Si' : 'No'}</p>
      </div>
      <div className='mt-3'>
        <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/lineas/${row.id}/edit`}>Editar</Link>
      </div>
    </section>
  )
}
