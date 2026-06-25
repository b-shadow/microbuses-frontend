import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { approveDriver, createDriver, DriverRow, listDrivers, rejectDriver } from '../services/module.service'

export function DriversPage() {
  const [rows, setRows] = useState<DriverRow[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | DriverRow['approval_status']>('ALL')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ci, setCi] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseCategory, setLicenseCategory] = useState('B')

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

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createDriver({ email, password, ci, full_name: fullName, phone, license_category: licenseCategory })
    setMessage(res.message)
    if (res.success) {
      setEmail('')
      setPassword('')
      setCi('')
      setFullName('')
      setPhone('')
      setLicenseCategory('B')
      await load()
    }
  }

  const onDecision = async (id: string, action: 'approve' | 'reject') => {
    const res = action === 'approve' ? await approveDriver(id) : await rejectDriver(id)
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h1 className='text-xl font-semibold'>Conductores</h1>
        <div className='flex items-center gap-2'>
          <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | DriverRow['approval_status'])}>
            <option value='ALL'>Todos</option>
            <option value='PENDING'>Pendientes</option>
            <option value='APPROVED'>Aprobados</option>
            <option value='REJECTED'>Rechazados</option>
          </select>
          <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/drivers/create'>Nuevo</Link>
        </div>
      </div>

      <form className='mt-4 grid gap-2 rounded-lg border p-3 sm:grid-cols-6 dark:border-slate-700' onSubmit={onCreate}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Contraseña' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='CI' value={ci} onChange={(e) => setCi(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Nombre completo' value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Teléfono' value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Licencia' value={licenseCategory} onChange={(e) => setLicenseCategory(e.target.value)} required />
        <button className='rounded bg-sky-600 px-3 py-1 text-white sm:col-span-6'>Crear conductor</button>
      </form>

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
              <th>Teléfono</th>
              <th>Licencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className='border-t dark:border-slate-800'>
                <td className='py-2'>{d.email}</td>
                <td>{d.full_name}</td>
                <td>{d.ci}</td>
                <td>{d.approval_status}</td>
                <td>{d.phone}</td>
                <td>{d.license_category}</td>
                <td className='space-x-2 py-2'>
                  <button className='rounded bg-emerald-600 px-2 py-1 text-white disabled:opacity-50' onClick={() => void onDecision(d.id, 'approve')} disabled={d.approval_status === 'APPROVED'}>Aprobar</button>
                  <button className='rounded bg-red-600 px-2 py-1 text-white disabled:opacity-50' onClick={() => void onDecision(d.id, 'reject')} disabled={d.approval_status === 'REJECTED'}>Rechazar</button>
                  <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/drivers/${d.id}`}>Ver</Link>
                  <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/drivers/${d.id}/edit`}>Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
