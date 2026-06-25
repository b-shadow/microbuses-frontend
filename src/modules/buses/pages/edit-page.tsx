import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getBus, updateBus } from '../services/module.service'

export function BusesEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [seats, setSeats] = useState('20')
  const [internalNumber, setInternalNumber] = useState('')
  const [status, setStatus] = useState('INACTIVE')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getBus(id)
      if (!res.success) {
        setMessage(res.message)
        return
      }
      setPlate(res.data.plate)
      setModel(res.data.model)
      setSeats(String(res.data.seats_count))
      setInternalNumber(res.data.internal_number)
      setStatus(res.data.status)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await updateBus(id, {
      plate,
      model,
      seats_count: Number(seats),
      internal_number: internalNumber,
      status,
    })
    setMessage(res.message)
    if (res.success) navigate('/buses')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Editar microbús</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Placa' value={plate} onChange={(e) => setPlate(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Modelo' value={model} onChange={(e) => setModel(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Asientos' value={seats} onChange={(e) => setSeats(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Número interno' value={internalNumber} onChange={(e) => setInternalNumber(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Estado' value={status} onChange={(e) => setStatus(e.target.value)} required />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Actualizar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
