import { FormEvent, useEffect, useState } from 'react'

import { listSettings, updateSettings } from '../services/module.service'

type Setting = { id: string; key: string; value: unknown; description?: string | null }

export function SettingsPage() {
  const [rows, setRows] = useState<Setting[]>([])
  const [keyName, setKeyName] = useState('boarding_mode')
  const [value, setValue] = useState('"ANYWHERE_ON_ROUTE"')
  const [message, setMessage] = useState('')

  const load = async () => {
    const r = await listSettings()
    if (r.success) {
      setRows(Array.isArray(r.data) ? r.data : [])
      setMessage('')
    } else {
      setMessage(r.message)
    }
  }

  useEffect(() => { void load() }, [])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    let parsed: unknown = value
    try { parsed = JSON.parse(value) } catch { parsed = value }
    const r = await updateSettings([{ key: keyName, value: parsed, description: 'updated from admin panel' }])
    setMessage(r.message)
    await load()
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Configuracion</h1>
      <form className='mt-3 grid gap-2 sm:grid-cols-3' onSubmit={save}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder='Key' />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={value} onChange={(e) => setValue(e.target.value)} placeholder='JSON value' />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
      </form>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <pre className='mt-4 rounded border p-3 text-xs dark:border-slate-700'>{JSON.stringify(rows, null, 2)}</pre>
    </section>
  )
}
