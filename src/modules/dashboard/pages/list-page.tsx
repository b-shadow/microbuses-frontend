import { useEffect, useState } from 'react'

import { DashboardData, getAdminDashboard } from '../services/module.service'

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    getAdminDashboard().then((res) => {
      if (res.success) setData(res.data)
    })
  }, [])

  return (
    <section>
      <h1 className='text-xl font-semibold'>Dashboard</h1>
      {!data ? <p className='mt-3 text-sm text-slate-500'>Cargando...</p> : (
        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          <div className='rounded border p-3'>Conductores: <strong>{data.drivers}</strong></div>
          <div className='rounded border p-3'>Microbuses: <strong>{data.buses}</strong></div>
          <div className='rounded border p-3'>Lineas: <strong>{data.lineas}</strong></div>
          <div className='rounded border p-3'>Linea ruta: <strong>{data.linea_ruta}</strong></div>
          <div className='rounded border p-3 sm:col-span-2'>Pendientes: <strong>{data.pending_drivers}</strong></div>
        </div>
      )}
    </section>
  )
}
