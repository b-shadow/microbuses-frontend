import { useEffect, useState } from 'react'

import { listActiveBuses } from '../services/module.service'

type ActiveBusRow = {
  bus_id: string
  plate?: string
  line_code?: string
  line_id?: string | number
  driver_name?: string
  updated_at?: string
}

export function ActiveBusesPage() {
  const [rows, setRows] = useState<ActiveBusRow[]>([])
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await listActiveBuses()
    if (res.success) {
      setRows(res.data)
      setMessage('')
    } else {
      setMessage(res.message)
    }
  }

  useEffect(() => {
    void load()
    const id = setInterval(() => void load(), 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <section>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Microbuses Activos</h1>
        <button className='rounded border px-3 py-1 text-sm dark:border-slate-700' onClick={() => void load()}>Refrescar</button>
      </div>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead><tr className='text-left'><th className='py-2'>Bus</th><th>Placa</th><th>Linea</th><th>Conductor</th><th>Ultima actualizacion</th></tr></thead>
          <tbody>
            {rows.map((x) => (
              <tr key={`${x.bus_id}-${x.updated_at ?? ''}`} className='border-t dark:border-slate-800'>
                <td className='py-2'>{x.bus_id}</td>
                <td>{x.plate ?? '-'}</td>
                <td>{x.line_code ?? x.line_id ?? '-'}</td>
                <td>{x.driver_name ?? '-'}</td>
                <td>{x.updated_at ? new Date(x.updated_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {rows.length === 0 ? <tr><td className='py-3 text-slate-500' colSpan={5}>Sin buses activos.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}
