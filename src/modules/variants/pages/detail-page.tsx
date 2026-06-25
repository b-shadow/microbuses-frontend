import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getVariant, VariantRow } from '../services/module.service'

export function VariantsDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<VariantRow | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getVariant(id)
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
      <h1 className='text-xl font-semibold'>Detalle variante</h1>
      <div className='mt-3 space-y-2 rounded border p-3 dark:border-slate-700'>
        <p><strong>ID:</strong> {row.id}</p>
        <p><strong>Línea:</strong> {row.line_id}</p>
        <p><strong>Nombre:</strong> {row.name}</p>
        <p><strong>Descripción:</strong> {row.description ?? 'Sin descripción'}</p>
        <p><strong>Activa:</strong> {row.is_active ? 'Sí' : 'No'}</p>
      </div>
      <div className='mt-3'>
        <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/variants/${row.id}/edit`}>Editar</Link>
      </div>
    </section>
  )
}
