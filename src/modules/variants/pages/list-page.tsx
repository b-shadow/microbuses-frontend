import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { createVariant, deleteVariant, listVariants, VariantRow } from '../services/module.service'

export function VariantsPage() {
  const [rows, setRows] = useState<VariantRow[]>([])
  const [lineId, setLineId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await listVariants()
    if (res.success) {
      setRows(res.data)
      setMessage('')
    } else {
      setMessage(res.message)
    }
  }

  useEffect(() => { void load() }, [])

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createVariant({ line_id: lineId, name, description })
    setMessage(res.message)
    if (res.success) {
      setName('')
      setDescription('')
      await load()
    }
  }

  const onDelete = async (id: string) => {
    const res = await deleteVariant(id)
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Variantes</h1>
        <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/variants/create'>Nueva variante</Link>
      </div>
      <form className='mt-3 grid gap-2 sm:grid-cols-4' onSubmit={onCreate}>
        <input className='rounded border px-2 py-1' placeholder='Line ID' value={lineId} onChange={(e) => setLineId(e.target.value)} required />
        <input className='rounded border px-2 py-1' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} required />
        <input className='rounded border px-2 py-1' placeholder='Descripción' value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Crear</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
      <ul className='mt-4 space-y-2 text-sm'>
        {rows.map((x) => (
          <li key={x.id} className='flex items-center justify-between rounded border p-2 dark:border-slate-700'>
            <span>{x.name} | line {x.line_id} | {x.is_active ? 'ACTIVA' : 'INACTIVA'}</span>
            <span className='space-x-2'>
              <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/variants/${x.id}`}>Ver</Link>
              <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/variants/${x.id}/edit`}>Editar</Link>
              <button className='rounded border px-2 py-1 dark:border-slate-700' onClick={() => void onDelete(x.id)}>Eliminar</button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
