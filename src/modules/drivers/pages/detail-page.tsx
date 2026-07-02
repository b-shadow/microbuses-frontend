import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { approveDriver, deleteDriver, DriverRow, getDriver, rejectDriver } from '../services/module.service'

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

export function DriversDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<DriverRow | null>(null)
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await getDriver(id)
    if (!res.success) {
      setMessage(res.message)
      return
    }
    setRow(res.data)
  }

  useEffect(() => {
    void load()
  }, [id])

  const onDecision = async (action: 'approve' | 'reject') => {
    const label = action === 'approve' ? 'aprobar' : 'rechazar'
    if (!window.confirm('Seguro de ' + label + ' este conductor?')) return
    const res = action === 'approve' ? await approveDriver(id) : await rejectDriver(id)
    setMessage(res.message)
    if (res.success) await load()
  }

  const onDelete = async () => {
    if (!row) return
    if (!window.confirm('Seguro de eliminar al conductor "' + row.full_name + '"? Esta accion no se puede deshacer.')) return
    const res = await deleteDriver(id)
    setMessage(res.message)
    if (res.success) window.location.href = '/drivers'
  }

  if (!row) return <p>{message || 'Cargando...'}</p>

  return (
    <section>
      <div className='flex items-center gap-3'>
        <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/drivers'>
          {'<-'} Volver
        </Link>
        <h1 className='text-xl font-semibold'>Detalle conductor</h1>
      </div>

      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}

      <div className='mt-4 grid max-w-2xl gap-3 rounded-lg border p-4 dark:border-slate-700'>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Email</span>
            <p>{row.email}</p>
          </div>
          <div>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Nombre completo</span>
            <p>{row.full_name}</p>
          </div>
        </div>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>CI</span>
            <p>{row.ci}</p>
          </div>
          <div>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Telefono</span>
            <p>{row.phone}</p>
          </div>
        </div>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Categoria de licencia</span>
            <p>{row.license_category}</p>
          </div>
          <div>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Estado de aprobacion</span>
            <p>
              <span className={'rounded px-2 py-0.5 text-xs font-medium ' + statusBadge[row.approval_status]}>
                {statusLabel[row.approval_status]}
              </span>
            </p>
          </div>
        </div>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Activo</span>
            <p>
              <span
                className={'rounded px-2 py-0.5 text-xs ' + (row.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300')}
              >
                {row.is_active ? 'Si' : 'No'}
              </span>
            </p>
          </div>
          {row.created_at && (
            <div>
              <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>Fecha de registro</span>
              <p>{new Date(row.created_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      <div className='mt-4 flex flex-wrap gap-2'>
        <Link className='rounded bg-sky-600 px-3 py-1 text-sm text-white hover:bg-sky-700' to={'/drivers/' + row.id + '/edit'}>
          Editar
        </Link>
        {row.approval_status !== 'APPROVED' && (
          <button className='rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700' onClick={() => void onDecision('approve')}>
            Aprobar
          </button>
        )}
        {row.approval_status !== 'REJECTED' && (
          <button className='rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700' onClick={() => void onDecision('reject')}>
            Rechazar
          </button>
        )}
        <button className='rounded bg-red-800 px-3 py-1 text-sm text-white hover:bg-red-900' onClick={() => void onDelete()}>
          Eliminar
        </button>
      </div>
    </section>
  )
}
