import { useEffect, useMemo, useState } from 'react'

import { getBusTracking, listActiveBuses } from '../services/module.service'

type ActiveBus = { trip_id: string; bus_id: string; driver_id: string; line_id: string }
type TrackingPoint = { id: string; active_trip_id: string; recorded_at: string; speed?: number | null }

export function TrackingPage() {
  const [rows, setRows] = useState<ActiveBus[]>([])
  const [selectedBusId, setSelectedBusId] = useState('')
  const [points, setPoints] = useState<TrackingPoint[]>([])
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await listActiveBuses()
    if (!res.success) {
      setMessage(res.message)
      return
    }
    setRows(res.data)
    if (!selectedBusId && res.data.length > 0) setSelectedBusId(res.data[0].bus_id)
  }

  const loadPoints = async () => {
    if (!selectedBusId) return
    const res = await getBusTracking(selectedBusId)
    if (!res.success) {
      setMessage(res.message)
      return
    }
    setPoints(res.data)
  }

  useEffect(() => {
    void load()
    const id = setInterval(() => void load(), 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    void loadPoints()
  }, [selectedBusId])

  const activeRows = useMemo(() => rows.filter((x) => x.bus_id === selectedBusId), [rows, selectedBusId])

  return (
    <section>
      <h1 className='text-xl font-semibold'>Tracking</h1>
      <div className='mt-3 flex gap-2'>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={selectedBusId} onChange={(e) => setSelectedBusId(e.target.value)}>
          <option value=''>Selecciona bus</option>
          {rows.map((x) => <option key={x.trip_id} value={x.bus_id}>{x.bus_id}</option>)}
        </select>
        <button className='rounded border px-3 py-1 dark:border-slate-700' onClick={() => void loadPoints()}>Refrescar puntos</button>
      </div>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <div className='mt-4 grid gap-4 md:grid-cols-2'>
        <div className='rounded border p-3 dark:border-slate-700'>
          <h2 className='font-medium'>Viajes activos (bus seleccionado)</h2>
          <ul className='mt-2 space-y-2 text-sm'>
            {activeRows.map((x) => <li key={x.trip_id}>trip {x.trip_id} | driver {x.driver_id} | line {x.line_id}</li>)}
            {activeRows.length === 0 ? <li>Sin viaje activo.</li> : null}
          </ul>
        </div>
        <div className='rounded border p-3 dark:border-slate-700'>
          <h2 className='font-medium'>Ultimos puntos</h2>
          <ul className='mt-2 max-h-64 space-y-2 overflow-auto text-sm'>
            {points.map((p) => <li key={p.id}>{p.recorded_at} | speed {p.speed ?? '-'}</li>)}
            {points.length === 0 ? <li>Sin puntos registrados.</li> : null}
          </ul>
        </div>
      </div>
    </section>
  )
}
