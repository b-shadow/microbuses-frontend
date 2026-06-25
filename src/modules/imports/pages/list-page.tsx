import { FormEvent, useEffect, useState } from 'react'

import { confirmImport, createImport, getImport, getImportErrors } from '../services/module.service'

type ImportRow = { id: string; status: string; total_rows: number; valid_rows: number; invalid_rows: number }

export function ImportsPage() {
  const [importId, setImportId] = useState('')
  const [fileName, setFileName] = useState('routes.xlsx')
  const [current, setCurrent] = useState<ImportRow | null>(null)
  const [errors, setErrors] = useState<unknown[]>([])
  const [message, setMessage] = useState('')

  const upload = async (e: FormEvent) => {
    e.preventDefault()
    const r = await createImport(fileName)
    setMessage(r.message)
    if (r.success) {
      setImportId(r.data.id)
      await load(r.data.id)
    }
  }

  const load = async (id = importId) => {
    if (!id) return
    const r = await getImport(id)
    if (r.success) {
      setCurrent(r.data)
      setMessage('')
    } else {
      setMessage(r.message)
    }
  }

  const loadErrors = async () => {
    if (!importId) return
    const r = await getImportErrors(importId)
    if (r.success) setErrors(r.data.errors)
  }

  const confirm = async () => {
    if (!importId) return
    const r = await confirmImport(importId)
    setMessage(r.message)
    await load(importId)
  }

  useEffect(() => { if (importId) void load(importId) }, [importId])

  return (
    <section>
      <h1 className='text-xl font-semibold'>Importaciones</h1>
      <form onSubmit={upload} className='mt-3 flex gap-2'>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder='Nombre archivo' />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Registrar upload</button>
      </form>
      <div className='mt-3 flex gap-2'>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={importId} onChange={(e) => setImportId(e.target.value)} placeholder='Import ID' />
        <button className='rounded border px-3 py-1 dark:border-slate-700' onClick={() => void load()}>Consultar</button>
        <button className='rounded border px-3 py-1 dark:border-slate-700' onClick={() => void loadErrors()}>Ver errores</button>
        <button className='rounded bg-emerald-600 px-3 py-1 text-white' onClick={confirm}>Confirmar</button>
      </div>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      {current ? <pre className='mt-4 rounded border p-3 text-xs dark:border-slate-700'>{JSON.stringify(current, null, 2)}</pre> : null}
      {errors.length > 0 ? <pre className='mt-3 rounded border p-3 text-xs dark:border-slate-700'>{JSON.stringify(errors, null, 2)}</pre> : null}
    </section>
  )
}
