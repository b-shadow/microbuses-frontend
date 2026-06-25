import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { changeBusLine, createBus, listBuses, listLines } from '../services/module.service'

type Bus = { id: string; plate: string; model: string; seats_count: number; internal_number: string; line_id: string | number; status: string }
type Line = { id: string | number; id_linea?: number; nombre_linea?: string; code?: string; name?: string; color_linea?: string; color?: string }

export function BusesPage() {
  const [rows, setRows] = useState<Bus[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [message, setMessage] = useState('')

  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [seats, setSeats] = useState('20')
  const [internalNumber, setInternalNumber] = useState('')
  const [lineId, setLineId] = useState('')

  const lineNameById = useMemo(() => {
    const map = new Map<string, string>()
    lines.forEach((line) => map.set(String(line.id), `${line.nombre_linea ?? line.name ?? line.code ?? line.id} `))
    return map
  }, [lines])

  const load = async () => {
    const [busesRes, linesRes] = await Promise.all([listBuses(), listLines()])
    if (busesRes.success) setRows(busesRes.data)
    if (linesRes.success) {
      setLines(linesRes.data)
      if (!lineId && linesRes.data.length > 0) setLineId(String(linesRes.data[0].id_linea ?? linesRes.data[0].id))
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createBus({
      plate,
      model,
      seats_count: Number(seats),
      internal_number: internalNumber,
      current_line_id: Number(lineId),
    })
    setMessage(res.message)
    if (res.success) {
      setPlate('')
      setModel('')
      setSeats('20')
      setInternalNumber('')
      await load()
    }
  }

  const onChangeLine = async (busId: string, nextLineId: string) => {
    const res = await changeBusLine(busId, Number(nextLineId))
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Microbuses</h1>
        <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/buses/create'>Nuevo bus</Link>
      </div>

      <form className='mt-3 grid gap-2 sm:grid-cols-5' onSubmit={onCreate}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Placa' value={plate} onChange={(e) => setPlate(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Modelo' value={model} onChange={(e) => setModel(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Asientos' value={seats} onChange={(e) => setSeats(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Nro interno' value={internalNumber} onChange={(e) => setInternalNumber(e.target.value)} required />
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={lineId} onChange={(e) => setLineId(e.target.value)}>
          {lines.map((line) => (
            <option key={String(line.id)} value={String(line.id_linea ?? line.id)}>{line.nombre_linea ?? line.name ?? line.code ?? line.id}</option>
          ))}
        </select>
        <button className='rounded bg-sky-600 px-3 py-1 text-white sm:col-span-5'>Crear</button>
      </form>

      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}

      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='py-2'>Placa</th>
              <th>Modelo</th>
              <th>Asientos</th>
              <th>Nro interno</th>
              <th>Linea</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((bus) => (
              <tr key={bus.id} className='border-t dark:border-slate-800'>
                <td className='py-2'>{bus.plate}</td>
                <td>{bus.model}</td>
                <td>{bus.seats_count}</td>
                <td>{bus.internal_number}</td>
                <td>
                  <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={String(bus.line_id)} onChange={(e) => void onChangeLine(bus.id, e.target.value)}>
                    {lines.map((line) => (
                      <option key={String(line.id)} value={String(line.id_linea ?? line.id)}>{lineNameById.get(String(line.id)) ?? String(line.id)}</option>
                    ))}
                  </select>
                </td>
                <td>{bus.status}</td>
                <td className='space-x-2'>
                  <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/buses/${bus.id}`}>Ver</Link>
                  <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/buses/${bus.id}/edit`}>Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
