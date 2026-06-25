import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getRoute, updateRoute } from '../services/module.service'

export function RoutesEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [descripcion, setDescripcion] = useState('')
  const [distancia, setDistancia] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [active, setActive] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getRoute(id)
      if (!res.success) {
        setMessage(res.message)
        return
      }
      setDescripcion(res.data.descripcion ?? '')
      setDistancia(res.data.distancia != null ? String(res.data.distancia) : '')
      setTiempo(res.data.tiempo != null ? String(res.data.tiempo) : '')
      setActive(res.data.is_active)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await updateRoute(id, {
      descripcion,
      distancia: distancia ? Number(distancia) : undefined,
      tiempo: tiempo ? Number(tiempo) : undefined,
      is_active: active,
    })
    setMessage(res.message)
    if (res.success) navigate('/linea-ruta')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Editar recorrido</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Distancia' value={distancia} onChange={(e) => setDistancia(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Tiempo' value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
        <label className='text-sm'><input type='checkbox' className='mr-2' checked={active} onChange={(e) => setActive(e.target.checked)} />Activo</label>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Actualizar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
