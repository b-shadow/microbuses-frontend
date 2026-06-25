import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getVariant, updateVariant } from '../services/module.service'

export function VariantsEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getVariant(id)
      if (!res.success) {
        setMessage(res.message)
        return
      }
      setName(res.data.name)
      setDescription(res.data.description ?? '')
      setActive(res.data.is_active)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await updateVariant(id, { name, description, is_active: active })
    setMessage(res.message)
    if (res.success) navigate('/variants')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Editar variante</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} required />
        <input className='rounded border px-2 py-1' placeholder='Descripción' value={description} onChange={(e) => setDescription(e.target.value)} />
        <label className='text-sm'><input type='checkbox' className='mr-2' checked={active} onChange={(e) => setActive(e.target.checked)} />Activa</label>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Actualizar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
