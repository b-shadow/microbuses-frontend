import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createStop, listRoutesLite } from '../services/module.service'

type RouteLite = { id: string | number; id_linea_ruta?: number; descripcion?: string }

export function StopsCreatePage() {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState<RouteLite[]>([])
  const [descripcion, setDescripcion] = useState('')
  const [latitud, setLatitud] = useState('-17.7833')
  const [longitud, setLongitud] = useState('-63.1821')
  const [stopType, setStopType] = useState('N')
  const [routeId, setRouteId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await listRoutesLite()
      if (!res.success) return
      setRoutes(res.data)
    }
    void load()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createStop({ descripcion, latitud: Number(latitud), longitud: Number(longitud), stop: stopType })
    setMessage(res.message)
    if (res.success) navigate('/puntos')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Nuevo punto</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Latitud' value={latitud} onChange={(e) => setLatitud(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Longitud' value={longitud} onChange={(e) => setLongitud(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Tipo stop' value={stopType} onChange={(e) => setStopType(e.target.value)} />
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={routeId} onChange={(e) => setRouteId(e.target.value)}>
          <option value=''>Sin ruta</option>
          {routes.map((r) => <option key={String(r.id)} value={String(r.id_linea_ruta ?? r.id)}>{r.id_linea_ruta ?? r.id} - {r.descripcion ?? 'Ruta'}</option>)}
        </select>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
