import { FormEvent, useEffect, useState } from 'react'

import { generatePackage, getLatestPackage, publishPackage } from '../services/module.service'

type OfflinePackage = { id: string; version: string; status: string; file_url?: string | null }

export function OfflinePackagesPage() {
  const [latest, setLatest] = useState<OfflinePackage | null>(null)
  const [version, setVersion] = useState('v1.0.0')
  const [message, setMessage] = useState('')

  const loadLatest = async () => {
    const r = await getLatestPackage()
    if (r.success) {
      setLatest(r.data || null)
      setMessage('')
    } else {
      setMessage(r.message)
    }
  }

  useEffect(() => { void loadLatest() }, [])

  const generate = async (e: FormEvent) => {
    e.preventDefault()
    const r = await generatePackage(version)
    setMessage(r.message)
    await loadLatest()
  }

  const publish = async () => {
    if (!latest?.id) return
    const r = await publishPackage(latest.id)
    setMessage(r.message)
    await loadLatest()
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Paquetes Offline</h1>
      <form className='mt-3 flex gap-2' onSubmit={generate}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={version} onChange={(e) => setVersion(e.target.value)} placeholder='Version' />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Generar</button>
      </form>
      <button className='mt-3 rounded bg-emerald-600 px-3 py-1 text-white disabled:opacity-50' onClick={publish} disabled={!latest?.id}>Publicar latest</button>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      {latest ? <pre className='mt-4 rounded border p-3 text-xs dark:border-slate-700'>{JSON.stringify(latest, null, 2)}</pre> : <p className='mt-3 text-sm text-slate-500'>Sin paquetes</p>}
    </section>
  )
}
