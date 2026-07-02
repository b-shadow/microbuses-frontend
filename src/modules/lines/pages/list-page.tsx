import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { createLine, deleteLine, LineRow, listLines } from '../services/module.service'

export function LinesPage() {
  const [rows, setRows] = useState<LineRow[]>([])
  const [nombreLinea, setNombreLinea] = useState('')
  const [colorLinea, setColorLinea] = useState('#0284C7')
  const [imagenMicro, setImagenMicro] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await listLines()
    if (res.success) {
      setRows(res.data)
      setMessage('')
    } else {
      setMessage(res.message || 'No se pudo cargar lineas')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createLine({
      nombre_linea: nombreLinea.trim(),
      color_linea: colorLinea,
      imagen_micro: imagenMicro.trim() || null,
    })
    setMessage(res.message)
    if (res.success) {
      setNombreLinea('')
      setImagenMicro('')
      await load()
    }
  }

  const onDelete = async (id: string | number) => {
    const res = await deleteLine(String(id))
    setMessage(res.message)
    if (res.success) await load()
  }

  return (
    <section>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='text-xl font-semibold'>Lineas</h1>
        <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/lineas/create'>Nueva linea</Link>
      </div>

      <form className='mt-3 grid gap-2 sm:grid-cols-4' onSubmit={onCreate}>
        <input className='rounded border px-2 py-1' placeholder='Nombre linea' value={nombreLinea} onChange={(e) => setNombreLinea(e.target.value)} required />
        <input className='rounded border px-2 py-1' placeholder='Imagen micro' value={imagenMicro} onChange={(e) => setImagenMicro(e.target.value)} />
        <input className='h-9 rounded border px-2 py-1' type='color' value={colorLinea} onChange={(e) => setColorLinea(e.target.value)} />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Crear</button>
      </form>

      {message ? <p className='mt-2 text-sm text-sky-700 dark:text-sky-300'>{message}</p> : null}

      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='py-2'>Id</th>
              <th>Nombre</th>
              <th>Color</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((line) => (
              <tr key={String(line.id)} className='border-t'>
                <td className='py-2'>{line.id_linea ?? line.id}</td>
                <td>{line.nombre_linea}</td>
                <td>
                  <span className='inline-block h-4 w-8 rounded' style={{ backgroundColor: line.color_linea ?? '#000' }} />
                </td>
                <td>{line.imagen_micro ?? '-'}</td>
                <td className='space-x-2'>
                  <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/lineas/${line.id}`}>Ver</Link>
                  <Link className='rounded border px-2 py-1 dark:border-slate-700' to={`/lineas/${line.id}/edit`}>Editar</Link>
                  <button className='rounded border px-2 py-1 dark:border-slate-700' onClick={() => void onDelete(line.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
