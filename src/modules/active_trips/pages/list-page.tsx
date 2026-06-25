import { useEffect, useMemo, useState } from 'react'

import { listTripsHistory } from '../services/module.service'

type Trip = { id: string; driver_id: string; bus_id: string; line_id: string; status: string }

export function ActiveTripsPage() {
  const [rows, setRows] = useState<Trip[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'FINISHED'>('ALL')

  const load = async () => {
    const res = await listTripsHistory()
    if (res.success) setRows(res.data)
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(
    () => rows.filter((r) => (statusFilter === 'ALL' ? true : r.status === statusFilter)),
    [rows, statusFilter],
  )

  return (
    <section>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='text-xl font-semibold'>Viajes</h1>
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'FINISHED')}>
          <option value='ALL'>Todos</option>
          <option value='ACTIVE'>Activos</option>
          <option value='FINISHED'>Finalizados</option>
        </select>
      </div>
      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead><tr className='text-left'><th className='py-2'>Trip</th><th>Bus</th><th>Driver</th><th>Linea</th><th>Estado</th></tr></thead>
          <tbody>
            {filtered.map((x) => <tr key={x.id} className='border-t dark:border-slate-800'><td className='py-2'>{x.id}</td><td>{x.bus_id}</td><td>{x.driver_id}</td><td>{x.line_id}</td><td>{x.status}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  )
}
