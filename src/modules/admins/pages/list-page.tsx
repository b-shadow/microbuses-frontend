import { FormEvent, useMemo, useState } from 'react'

import { useModuleActions } from '../hooks/use-module-actions'
import { useModuleList } from '../hooks/use-module-list'

export function AdminsPage() {
  const { rows, loading, error, reload } = useModuleList()
  const { create, toggleActive, update } = useModuleActions(reload)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN')
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN')

  const sortedRows = useMemo(() => [...rows].sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1)), [rows])

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    const res = await create({ email, password, full_name: fullName, role })
    setMessage(res.message)
    if (res.success) {
      setEmail('')
      setPassword('')
      setFullName('')
      setRole('ADMIN')
    }
  }

  const startEdit = (row: { id: string; full_name: string; role: 'ADMIN' | 'SUPER_ADMIN' }) => {
    setEditingId(row.id)
    setEditName(row.full_name)
    setEditRole(row.role)
  }

  const submitEdit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    const res = await update(editingId, { full_name: editName, role: editRole })
    setMessage(res.message)
    if (res.success) setEditingId(null)
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Administradores</h1>
      <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>Gestión de cuentas ADMIN y SUPER_ADMIN.</p>

      <form className='mt-4 grid gap-2 rounded-lg border p-3 sm:grid-cols-5 dark:border-slate-700' onSubmit={onCreate}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Contraseña' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Nombre completo' value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={role} onChange={(e) => setRole(e.target.value as 'ADMIN' | 'SUPER_ADMIN')}>
          <option value='ADMIN'>ADMIN</option>
          <option value='SUPER_ADMIN'>SUPER_ADMIN</option>
        </select>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Crear</button>
      </form>

      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      {error ? <p className='mt-2 text-sm text-red-500'>{error}</p> : null}
      {loading ? <p className='mt-3 text-sm'>Cargando...</p> : null}

      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='py-2'>Email</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((admin) => (
              <tr key={admin.id} className='border-t dark:border-slate-800'>
                <td className='py-2'>{admin.email}</td>
                <td>{admin.full_name}</td>
                <td>{admin.role}</td>
                <td>
                  <span className={`rounded px-2 py-1 text-xs ${admin.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {admin.is_active ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </td>
                <td className='space-x-2'>
                  <button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => startEdit(admin)}>Editar</button>
                  <button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => void toggleActive(admin.id, admin.is_active)}>
                    {admin.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId ? (
        <form className='mt-4 grid gap-2 rounded-lg border p-3 sm:grid-cols-3 dark:border-slate-700' onSubmit={submitEdit}>
          <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={editName} onChange={(e) => setEditName(e.target.value)} required />
          <select className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={editRole} onChange={(e) => setEditRole(e.target.value as 'ADMIN' | 'SUPER_ADMIN')}>
            <option value='ADMIN'>ADMIN</option>
            <option value='SUPER_ADMIN'>SUPER_ADMIN</option>
          </select>
          <div className='space-x-2'>
            <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
            <button type='button' className='rounded border px-3 py-1 dark:border-slate-700' onClick={() => setEditingId(null)}>Cancelar</button>
          </div>
        </form>
      ) : null}
    </section>
  )
}
