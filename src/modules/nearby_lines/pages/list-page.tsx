import { FormEvent, useState } from 'react'

import { searchNearbyLines, type NearbyLine } from '../services/module.service'

export function NearbyLinesPage() {
  const [lat, setLat] = useState('-17.7833')
  const [lng, setLng] = useState('-63.1821')
  const [radius, setRadius] = useState('300')
  const [rows, setRows] = useState<NearbyLine[]>([])
  const [message, setMessage] = useState('')

  const onSearch = async (e: FormEvent) => {
    e.preventDefault()
    const res = await searchNearbyLines(Number(lat), Number(lng), Number(radius))
    if (res.success) {
      setRows(res.data)
      setMessage('')
    } else {
      setMessage(res.message)
    }
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Lineas cercanas</h1>
      <form className='mt-3 grid gap-2 sm:grid-cols-4' onSubmit={onSearch}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={lat} onChange={(e) => setLat(e.target.value)} placeholder='Lat' required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={lng} onChange={(e) => setLng(e.target.value)} placeholder='Lng' required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={radius} onChange={(e) => setRadius(e.target.value)} placeholder='Radio (m)' required />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Buscar</button>
      </form>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <ul className='mt-4 space-y-2 text-sm'>
        {rows.map((x) => (
          <li key={String(x.id)} className='rounded border p-2 dark:border-slate-700'>
            <span style={{ color: x.color_linea ?? x.color ?? '#000' }}>?</span> {x.nombre_linea ?? x.name ?? x.code}
          </li>
        ))}
        {rows.length === 0 ? <li className='text-slate-500'>Sin resultados.</li> : null}
      </ul>
    </section>
  )
}
