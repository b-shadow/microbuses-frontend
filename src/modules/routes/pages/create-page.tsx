import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createRoute, listLinesLite } from '../services/module.service'

type LineRow = { id: string | number; id_linea?: number; nombre_linea?: string; code?: string; name?: string; color_linea?: string; color?: string }

export function RoutesCreatePage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<LineRow[]>([])
  const [lineId, setLineId] = useState('')
  const [routeId, setRouteId] = useState('1')
  const [descripcion, setDescripcion] = useState('L001 Ruta Salida')
  const [distancia, setDistancia] = useState('22.06')
  const [tiempo, setTiempo] = useState('1.10')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await listLinesLite()
      if (!res.success) return
      setLines(res.data)
      if (res.data[0]) setLineId(String(res.data[0].id_linea ?? res.data[0].id))
    }
    void load()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createRoute({
      id_linea: Number(lineId),
      id_ruta: Number(routeId),
      descripcion,
      distancia: Number(distancia),
      tiempo: Number(tiempo),
    })
    setMessage(res.message)
    if (res.success) navigate('/linea-ruta')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Nuevo recorrido</h1>
      <form className='mt-3 grid max-w-2xl gap-2' onSubmit={onSubmit}>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={lineId} onChange={(e) => setLineId(e.target.value)}>
          {lines.map((line) => <option key={String(line.id)} value={String(line.id_linea ?? line.id)}>{line.nombre_linea ?? line.name ?? line.code}</option>)}
        </select>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={routeId} onChange={(e) => setRouteId(e.target.value)}>
          <option value='1'>Salida</option>
          <option value='2'>Retorno</option>
        </select>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Distancia' value={distancia} onChange={(e) => setDistancia(e.target.value)} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Tiempo' value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
