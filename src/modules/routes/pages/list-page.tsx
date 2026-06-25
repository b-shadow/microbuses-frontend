import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { createRoute, deactivateRoute, listLinesLite, listRoutes } from '../services/module.service'

type RouteRow = {
  id: string | number
  id_linea_ruta?: number
  id_linea?: number
  line_id?: string
  id_ruta?: number
  direction?: string
  descripcion?: string
  distancia?: number | null
  tiempo?: number | null
  is_active: boolean
}

type LineRow = { id: string | number; id_linea?: number; nombre_linea?: string; code?: string; name?: string; color_linea?: string; color?: string }

export function RoutesPage() {
  const [rows, setRows] = useState<RouteRow[]>([])
  const [lines, setLines] = useState<LineRow[]>([])
  const [lineId, setLineId] = useState('')
  const [routeId, setRouteId] = useState('1')
  const [descripcion, setDescripcion] = useState('L001 Ruta Salida')
  const [distancia, setDistancia] = useState('22.06')
  const [tiempo, setTiempo] = useState('1.10')
  const [message, setMessage] = useState('')

  const load = async () => {
    const [routesRes, linesRes] = await Promise.all([listRoutes(), listLinesLite()])
    if (routesRes.success) setRows(routesRes.data)
    if (linesRes.success) {
      setLines(linesRes.data)
      if (!lineId && linesRes.data.length > 0) setLineId(String(linesRes.data[0].id_linea ?? linesRes.data[0].id))
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const create = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createRoute({
      id_linea: Number(lineId),
      id_ruta: Number(routeId),
      descripcion,
      distancia: Number(distancia),
      tiempo: Number(tiempo),
    })
    setMessage(res.message)
    if (res.success) await load()
  }

  const deactivate = async (id: string | number) => {
    const res = await deactivateRoute(String(id))
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Linea ruta</h1>
        <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/linea-ruta/create'>Nuevo recorrido</Link>
      </div>
      <form className='mt-3 grid gap-2' onSubmit={create}>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={lineId} onChange={(e) => setLineId(e.target.value)}>
          {lines.map((line) => <option key={String(line.id)} value={String(line.id_linea ?? line.id)}>{line.nombre_linea ?? line.name ?? line.code}</option>)}
        </select>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={routeId} onChange={(e) => setRouteId(e.target.value)}>
          <option value='1'>Salida</option>
          <option value='2'>Retorno</option>
        </select>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Distancia' value={distancia} onChange={(e) => setDistancia(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Tiempo' value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Crear</button>
      </form>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead><tr className='text-left'><th className='py-2'>ID</th><th>Linea</th><th>Ruta</th><th>Descripcion</th><th>Activo</th><th>Acciones</th></tr></thead>
          <tbody>
            {rows.map((x) => (
              <tr key={String(x.id)} className='border-t dark:border-slate-800'>
                <td className='py-2'>{x.id_linea_ruta ?? x.id}</td><td>{x.id_linea ?? '-'}</td><td>{x.id_ruta ?? x.direction ?? '-'}</td><td>{x.descripcion ?? '-'}</td><td>{x.is_active ? 'SI' : 'NO'}</td>
                <td className='space-x-2'>
                  <button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => void deactivate(x.id)}>Desactivar</button>
                  <Link className='rounded border px-2 py-1 text-xs dark:border-slate-700' to={`/linea-ruta/${x.id}`}>Ver</Link>
                  <Link className='rounded border px-2 py-1 text-xs dark:border-slate-700' to={`/linea-ruta/${x.id}/edit`}>Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
