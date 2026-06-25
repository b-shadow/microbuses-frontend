import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { createRoutePoint, deleteRoutePoint, listRoutePoints, listRoutesLite, updateRoutePoint } from '../services/module.service'

type RoutePoint = {
  id: string | number
  id_linea_punto?: number
  route_id?: string
  id_linea_ruta?: number
  id_punto?: number
  id_punto_dest?: number
  sequence?: number
  orden?: number
  lat?: number | null
  lng?: number | null
  distancia?: number | null
  tiempo?: number | null
}

type RouteLite = { id: string | number; id_linea_ruta?: number; description?: string; descripcion?: string }

export function RoutePointsPage() {
  const [rows, setRows] = useState<RoutePoint[]>([])
  const [routes, setRoutes] = useState<RouteLite[]>([])
  const [routeId, setRouteId] = useState('')
  const [idPunto, setIdPunto] = useState('1')
  const [idPuntoDest, setIdPuntoDest] = useState('2')
  const [orden, setOrden] = useState('1')
  const [distancia, setDistancia] = useState('0')
  const [tiempo, setTiempo] = useState('0')
  const [message, setMessage] = useState('')

  const [editId, setEditId] = useState<string | null>(null)
  const [editOrden, setEditOrden] = useState('1')

  const load = async () => {
    const [pointsRes, routesRes] = await Promise.all([listRoutePoints(), listRoutesLite()])
    if (pointsRes.success) setRows(pointsRes.data)
    if (routesRes.success) {
      setRoutes(routesRes.data)
      if (!routeId && routesRes.data.length) setRouteId(String(routesRes.data[0].id_linea_ruta ?? routesRes.data[0].id))
    }
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => rows.filter((r) => !routeId || String(r.id_linea_ruta ?? r.route_id) === routeId).sort((a, b) => (a.orden ?? a.sequence ?? 0) - (b.orden ?? b.sequence ?? 0)), [rows, routeId])

  const create = async (e: FormEvent) => {
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
    if (res.success) await load()
  }

  const saveEdit = async () => {
    if (!editId) return
    const res = await updateRoutePoint(editId, { orden: Number(editOrden) })
    setMessage(res.message)
    if (res.success) {
      setEditId(null)
      await load()
    }
  }

  const removePoint = async (id: string | number) => {
    const res = await deleteRoutePoint(String(id))
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Lineas puntos</h1>
        <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/lineas-puntos/create'>Nuevo punto</Link>
      </div>
      <form className='mt-3 grid gap-2 sm:grid-cols-6' onSubmit={create}>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={routeId} onChange={(e) => setRouteId(e.target.value)}>
          {routes.map((r) => <option key={String(r.id)} value={String(r.id_linea_ruta ?? r.id)}>{r.id_linea_ruta ?? r.id} - {r.descripcion ?? r.description ?? 'Ruta'}</option>)}
        </select>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Id punto' value={idPunto} onChange={(e) => setIdPunto(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Id punto dest' value={idPuntoDest} onChange={(e) => setIdPuntoDest(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Orden' value={orden} onChange={(e) => setOrden(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Distancia' value={distancia} onChange={(e) => setDistancia(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Tiempo' value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
        <button className='rounded bg-sky-600 px-3 py-1 text-white sm:col-span-6'>Agregar</button>
      </form>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead><tr className='text-left'><th className='py-2'>Ruta</th><th>Punto</th><th>Destino</th><th>Orden</th><th>Lat</th><th>Lng</th><th>Acciones</th></tr></thead>
          <tbody>
            {filtered.map((x) => (
              <tr key={String(x.id)} className='border-t dark:border-slate-800'>
                <td className='py-2'>{x.id_linea_ruta ?? x.route_id}</td>
                <td>{x.id_punto ?? '-'}</td>
                <td>{x.id_punto_dest ?? '-'}</td>
                <td>{editId === x.id ? <input className='w-20 rounded border px-1 py-0.5 dark:border-slate-700 dark:bg-slate-800' value={editOrden} onChange={(e) => setEditOrden(e.target.value)} /> : (x.orden ?? x.sequence)}</td>
                <td>{x.lat ?? '-'}</td><td>{x.lng ?? '-'}</td>
                <td className='space-x-2'>
                  <Link className='rounded border px-2 py-1 text-xs dark:border-slate-700' to={`/lineas-puntos/${x.id}`}>Ver</Link>
                  <Link className='rounded border px-2 py-1 text-xs dark:border-slate-700' to={`/lineas-puntos/${x.id}/edit`}>Editar</Link>
                  {editId === x.id ? (
                    <button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => void saveEdit()}>Guardar Orden</button>
                  ) : (
                    <button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => { setEditId(String(x.id)); setEditOrden(String(x.orden ?? x.sequence ?? 1)) }}>Editar Orden</button>
                  )}
                  <button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => void removePoint(x.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
