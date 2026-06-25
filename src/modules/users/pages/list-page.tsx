import { FormEvent, useEffect, useState } from 'react'

import { listUsers, updateUser, UserRow } from '../services/module.service'

export function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([])
  const [message, setMessage] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [names, setNames] = useState('')
  const [lastNames, setLastNames] = useState('')
  const [phone, setPhone] = useState('')

  const load = async () => {
    const res = await listUsers()
    if (res.success) {
      setRows(res.data)
      setMessage('')
    } else {
      setMessage(res.message)
    }
  }

  useEffect(() => { void load() }, [])

  const startEdit = (row: UserRow) => {
    setEditId(row.id)
    setNames(row.names ?? '')
    setLastNames(row.last_names ?? '')
    setPhone(row.phone ?? '')
  }

  const onSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!editId) return
    const res = await updateUser(editId, { names, last_names: lastNames, phone })
    setMessage(res.message)
    if (res.success) {
      setEditId(null)
      await load()
    }
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Usuarios</h1>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}

      {editId ? (
        <form className='mt-3 grid gap-2 rounded border p-3 dark:border-slate-700 sm:grid-cols-4' onSubmit={onSave}>
          <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={names} onChange={(e) => setNames(e.target.value)} placeholder='Nombres' />
          <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={lastNames} onChange={(e) => setLastNames(e.target.value)} placeholder='Apellidos' />
          <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Telefono' />
          <div className='flex gap-2'>
            <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
            <button type='button' className='rounded border px-3 py-1 dark:border-slate-700' onClick={() => setEditId(null)}>Cancelar</button>
          </div>
        </form>
      ) : null}

      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead><tr className='text-left'><th className='py-2'>Email</th><th>Nombres</th><th>Apellidos</th><th>Telefono</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id} className='border-t dark:border-slate-800'>
                <td className='py-2'>{x.email}</td>
                <td>{x.names ?? '-'}</td>
                <td>{x.last_names ?? '-'}</td>
                <td>{x.phone ?? '-'}</td>
                <td>{x.is_active === false ? 'INACTIVO' : 'ACTIVO'}</td>
                <td><button className='rounded border px-2 py-1 text-xs dark:border-slate-700' onClick={() => startEdit(x)}>Editar</button></td>
              </tr>
            ))}
            {rows.length === 0 ? <tr><td className='py-3 text-slate-500' colSpan={6}>Sin usuarios.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}