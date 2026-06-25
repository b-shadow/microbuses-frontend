import { FormEvent, useEffect, useState } from 'react'

import { createAssignment, listAssignments, listBusesLite, listDriversLite, removeAssignment } from '../services/module.service'

type AssignmentRow = { id: string; bus_id: string; driver_id: string; is_active: boolean; assigned_at?: string | null }
type BusRow = { id: string; plate: string }
type DriverRow = { id: string; full_name: string; approval_status: string }

export function BusAssignmentsPage() {
  const [rows, setRows] = useState<AssignmentRow[]>([])
  const [buses, setBuses] = useState<BusRow[]>([])
  const [drivers, setDrivers] = useState<DriverRow[]>([])
  const [busId, setBusId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    const [a, b, d] = await Promise.all([listAssignments(), listBusesLite(), listDriversLite()])
    if (a.success) setRows(a.data)
    if (b.success) {
      setBuses(b.data)
      if (!busId && b.data.length) setBusId(b.data[0].id)
    }
    if (d.success) {
      setDrivers(d.data)
      if (!driverId && d.data.length) setDriverId(d.data[0].id)
    }
  }

  useEffect(() => { void load() }, [])

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createAssignment(busId, driverId)
    setMessage(res.message)
    if (res.success) await load()
  }

  const onRemove = async (busIdToRemove: string, driverIdToRemove: string) => {
    const res = await removeAssignment(busIdToRemove, driverIdToRemove)
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Asignaciones Bus-Conductor</h1>
      <form className='mt-3 grid gap-2 sm:grid-cols-3' onSubmit={onCreate}>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={busId} onChange={(e) => setBusId(e.target.value)}>
          {buses.map((b) => <option key={b.id} value={b.id}>{b.plate}</option>)}
        </select>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={driverId} onChange={(e) => setDriverId(e.target.value)}>
          {drivers.map((d) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
        </select>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Asignar</button>
      </form>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead><tr className='text-left'><th className='py-2'>Bus ID</th><th>Driver ID</th><th>Activo</th><th>Asignado</th><th>Acciones</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className='border-t dark:border-slate-800'>
                <td className='py-2'>{r.bus_id}</td><td>{r.driver_id}</td><td>{r.is_active ? 'SI' : 'NO'}</td><td>{r.assigned_at ?? '-'}</td>
                <td>
                  {r.is_active ? (
                    <button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => void onRemove(r.bus_id, r.driver_id)}>
                      Quitar
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
