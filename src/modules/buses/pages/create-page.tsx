import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createBus, listLines } from '../services/module.service'

type Line = { id: string | number; id_linea?: number; nombre_linea?: string; code?: string; name?: string }

export function BusesCreatePage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<Line[]>([])
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [seats, setSeats] = useState('20')
  const [internalNumber, setInternalNumber] = useState('')
  const [lineId, setLineId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await listLines()
      if (!res.success) return
      setLines(res.data)
      if (res.data[0]) setLineId(String(res.data[0].id_linea ?? res.data[0].id))
    }
    void load()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createBus({
      plate,
      model,
      seats_count: Number(seats),
      internal_number: internalNumber,
      current_line_id: Number(lineId),
    })
    setMessage(res.message)
    if (res.success) navigate('/buses')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Nuevo microbus</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Placa' value={plate} onChange={(e) => setPlate(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Modelo' value={model} onChange={(e) => setModel(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Asientos' value={seats} onChange={(e) => setSeats(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Numero interno' value={internalNumber} onChange={(e) => setInternalNumber(e.target.value)} required />
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={lineId} onChange={(e) => setLineId(e.target.value)}>
          {lines.map((line) => <option key={String(line.id)} value={String(line.id_linea ?? line.id)}>{line.nombre_linea ?? line.name ?? line.code ?? line.id}</option>)}
        </select>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
