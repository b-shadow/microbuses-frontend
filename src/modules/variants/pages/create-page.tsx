import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createVariant } from '../services/module.service'

export function VariantsCreatePage() {
  const navigate = useNavigate()
  const [lineId, setLineId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createVariant({ line_id: lineId, name, description })
    setMessage(res.message)
    if (res.success) navigate('/variants')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Nueva variante</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1' placeholder='Line ID' value={lineId} onChange={(e) => setLineId(e.target.value)} required />
        <input className='rounded border px-2 py-1' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} required />
        <input className='rounded border px-2 py-1' placeholder='Descripción' value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
