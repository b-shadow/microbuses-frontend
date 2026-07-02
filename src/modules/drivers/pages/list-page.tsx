import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { approveDriver, deleteDriver, DriverRow, listDrivers, rejectDriver } from '../services/module.service'

const statusBadge: Record<DriverRow['approval_status'], string> = {
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

const statusLabel: Record<DriverRow['approval_status'], string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
}

export function DriversPage() {
  const [rows, setRows] = useState<DriverRow[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | DriverRow['approval_status']>('ALL')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await listDrivers(statusFilter === 'ALL' ? undefined : statusFilter)
    if (res.success) {
      setRows(res.data)
      setMessage('')
    } else {
      setMessage(res.message || 'No se pudo cargar conductores')
    }
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [statusFilter])

  const onDecision = async (id: string, action: 'approve' | 'reject') => {
    const label = action === 'approve' ? 'aprobar' : 'rechazar'
    if (!window.confirm(`\u00bfEst\u00e1s seguro de ${label} este conductor?`)) return
    const res = action === 'approve' ? await approveDriver(id) : await rejectDriver(id)
    setMessage(res.message)
    if (res.success) await load()
  }

  const onDelete = async (id: string, name: string) => {
    if (!window.confirm(`\u00bfEst\u00e1s seguro de eliminar al conductor "${name}"? Esta acci\u00f3n no se puede deshacer.`)) return
    const res = await deleteDriver(id)
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>
          <h1 className='text-xl font-semibold'>Conductores</h1>
          <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>Gesti&oacute;n de cuentas de conductores.</p>
        </div>
        <div className='flex items-center gap-2'>
          <select
            className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | DriverRow['approval_status'])}
          >
            <option value='ALL'>Todos</option>
            <option value='PENDING'>Pendientes</option>
            <option value='APPROVED'>Aprobados</option>
            <option value='REJECTED'>Rechazados</option>
          </select>
          <Link className='rounded bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-700' to='/drivers/create'>
            + Nuevo
          </Link>
        </div>
      </div>

      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      {loading ? <p className='mt-2 text-sm'>Cargando...</p> : null}

      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='py-2'>Email</th>
              <th>Nombre</th>
              <th>CI</th>
              <th>Estado</th>
              <th>Tel&eacute;fono</th>
              <th>Licencia</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className='border-t dark:border-slate-800'>
                <td className='py-2'>{d.email}</td>
                <td>{d.full_name}</td>
                <td>{d.ci}</td>
                <td>
                  <span className={'rounded px-2 py-0.5 text-xs font-medium ' + statusBadge[d.approval_status]}>
                    {statusLabel[d.approval_status]}
                  </span>
                </td>
                <td>{d.phone}</td>
                <td>{d.license_category}</td>
                <td>
                  <span
                    className={'rounded px-2 py-0.5 text-xs ' + (d.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300')}
                  >
                    {d.is_active ? 'S\u00ed' : 'No'}
                  </span>
                </td>
                <td className='space-x-1 whitespace-nowrap py-2'>
                  {d.approval_status !== 'APPROVED' && (
                    <button
                      className='rounded bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700'
                      onClick={() => void onDecision(d.id, 'approve')}
                    >
                      Aprobar
                    </button>
                  )}
                  {d.approval_status !== 'REJECTED' && (
                    <button
                      className='rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700'
                      onClick={() => void onDecision(d.id, 'reject')}
                    >
                      Rechazar
                    </button>
                  )}
                  <Link className='inline-block rounded border px-2 py-1 text-xs dark:border-slate-700' to={'/drivers/' + d.id}>
                    Ver
                  </Link>
                  <Link className='inline-block rounded border px-2 py-1 text-xs dark:border-slate-700' to={'/drivers/' + d.id + '/edit'}>
                    Editar
                  </Link>
                  <button
                    className='rounded bg-red-800 px-2 py-1 text-xs text-white hover:bg-red-900'
                    onClick={() => void onDelete(d.id, d.full_name)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} className='py-6 text-center text-slate-500'>
                  No se encontraron conductores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}