import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createRoutePoint, listRoutesLite } from '../services/module.service'

type RouteLite = { id: string | number; id_linea_ruta?: number; descripcion?: string }

export function RoutePointsCreatePage() {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState<RouteLite[]>([])
  const [routeId, setRouteId] = useState('')
  const [idPunto, setIdPunto] = useState('1')
  const [idPuntoDest, setIdPuntoDest] = useState('2')
  const [orden, setOrden] = useState('1')
  const [distancia, setDistancia] = useState('0')
  const [tiempo, setTiempo] = useState('0')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await listRoutesLite()
      if (!res.success) return
      setRoutes(res.data)
      if (res.data[0]) setRouteId(String(res.data[0].id_linea_ruta ?? res.data[0].id))
    }
    void load()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createRoutePoint({
      id_linea_ruta: Number(routeId),
      id_punto: Number(idPunto),
      id_punto_dest: Number(idPuntoDest),
      orden: Number(orden),
      distancia: Number(distancia),
      tiempo: Number(tiempo),
    })
    setMessage(res.message)
    if (res.success) navigate('/lineas-puntos')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Nuevo punto de linea ruta</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={routeId} onChange={(e) => setRouteId(e.target.value)}>
          {routes.map((r) => <option key={String(r.id)} value={String(r.id_linea_ruta ?? r.id)}>{r.id_linea_ruta ?? r.id} - {r.descripcion ?? 'Ruta'}</option>)}
        </select>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={idPunto} onChange={(e) => setIdPunto(e.target.value)} placeholder='Id punto' required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={idPuntoDest} onChange={(e) => setIdPuntoDest(e.target.value)} placeholder='Id punto destino' required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={orden} onChange={(e) => setOrden(e.target.value)} placeholder='Orden' required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={distancia} onChange={(e) => setDistancia(e.target.value)} placeholder='Distancia' />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={tiempo} onChange={(e) => setTiempo(e.target.value)} placeholder='Tiempo' />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
