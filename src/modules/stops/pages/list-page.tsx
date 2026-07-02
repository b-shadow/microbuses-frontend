import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { createStop, deactivateStop, listRoutesLite, listStops, updateStop, type RouteLite, type StopRow } from '../services/module.service'

export function StopsPage() {
  const [rows, setRows] = useState<StopRow[]>([])
  const [routes, setRoutes] = useState<RouteLite[]>([])
  const [descripcion, setDescripcion] = useState('')
  const [latitud, setLatitud] = useState('-17.7833')
  const [longitud, setLongitud] = useState('-63.1821')
  const [stopType, setStopType] = useState('N')
  const [routeId, setRouteId] = useState('')
  const [onlyActive, setOnlyActive] = useState(true)
  const [message, setMessage] = useState('')

  const load = async () => {
    const [stopsRes, routesRes] = await Promise.all([listStops(), listRoutesLite()])
    if (stopsRes.success) setRows(stopsRes.data)
    if (routesRes.success) {
      setRoutes(routesRes.data)
      if (!routeId && routesRes.data.length) setRouteId(String(routesRes.data[0].id_linea_ruta ?? routesRes.data[0].id))
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const visible = useMemo(() => rows.filter((s) => (onlyActive ? s.is_active : true)), [rows, onlyActive])

  const create = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createStop({ descripcion, latitud: Number(latitud), longitud: Number(longitud), stop: stopType })
    setMessage(res.message)
    if (res.success) {
      setDescripcion('')
      await load()
    }
  }

  const toggleActive = async (stop: StopRow) => {
    if (stop.is_active) {
      const res = await deactivateStop(String(stop.id))
      setMessage(res.message)
      if (res.success) await load()
      return
    }
    const res = await updateStop(String(stop.id), { is_active: true })
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='text-xl font-semibold'>Puntos</h1>
        <div className='flex items-center gap-2'>
          <label className='text-sm'>
            <input type='checkbox' className='mr-1' checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
            Solo activos
          </label>
          <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/puntos/create'>Nuevo punto</Link>
        </div>
      </div>
      <form className='mt-3 grid gap-2 sm:grid-cols-6' onSubmit={create}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Latitud' value={latitud} onChange={(e) => setLatitud(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Longitud' value={longitud} onChange={(e) => setLongitud(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Tipo' value={stopType} onChange={(e) => setStopType(e.target.value)} />
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={routeId} onChange={(e) => setRouteId(e.target.value)}>
          <option value=''>Sin ruta</option>
          {routes.map((r) => <option key={String(r.id)} value={String(r.id_linea_ruta ?? r.id)}>{r.id_linea_ruta ?? r.id} - {r.descripcion ?? 'Ruta'}</option>)}
        </select>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Crear</button>
      </form>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead><tr className='text-left'><th className='py-2'>Descripcion</th><th>Ruta</th><th>Activa</th><th>Acciones</th></tr></thead>
          <tbody>
            {visible.map((x) => (
              <tr key={String(x.id)} className='border-t dark:border-slate-800'>
                <td className='py-2'>{x.descripcion}</td><td>{routeId || 'Sin ruta'}</td><td>{x.is_active ? 'SI' : 'NO'}</td>
                <td className='space-x-2'>
                  <button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => void toggleActive(x)}>{x.is_active ? 'Desactivar' : 'Activar'}</button>
                  <Link className='rounded border px-2 py-1 text-xs dark:border-slate-700' to={`/puntos/${x.id}`}>Ver</Link>
                  <Link className='rounded border px-2 py-1 text-xs dark:border-slate-700' to={`/puntos/${x.id}/edit`}>Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
