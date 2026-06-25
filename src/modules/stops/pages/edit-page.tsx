import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getStop, updateStop } from '../services/module.service'

export function StopsEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [descripcion, setDescripcion] = useState('')
  const [latitud, setLatitud] = useState('')
  const [longitud, setLongitud] = useState('')
  const [stopType, setStopType] = useState('N')
  const [active, setActive] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getStop(id)
      if (!res.success) {
        setMessage(res.message)
        return
      }
      setDescripcion(res.data.descripcion ?? '')
      setLatitud(res.data.latitud != null ? String(res.data.latitud) : '')
      setLongitud(res.data.longitud != null ? String(res.data.longitud) : '')
      setStopType(res.data.stop ?? 'N')
      setActive(res.data.is_active)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await updateStop(id, {
      descripcion,
      latitud: latitud ? Number(latitud) : undefined,
      longitud: longitud ? Number(longitud) : undefined,
      stop: stopType,
      is_active: active,
    })
    setMessage(res.message)
    if (res.success) navigate('/puntos')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Editar punto</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Latitud' value={latitud} onChange={(e) => setLatitud(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Longitud' value={longitud} onChange={(e) => setLongitud(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Tipo stop' value={stopType} onChange={(e) => setStopType(e.target.value)} />
        <label className='text-sm'>
          <input type='checkbox' className='mr-2' checked={active} onChange={(e) => setActive(e.target.checked)} />Activa
        </label>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Actualizar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
