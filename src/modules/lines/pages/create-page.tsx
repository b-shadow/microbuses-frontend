import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createLine } from '../services/module.service'

export function LinesCreatePage() {
  const navigate = useNavigate()
  const [nombreLinea, setNombreLinea] = useState('')
  const [colorLinea, setColorLinea] = useState('#0284C7')
  const [imagenMicro, setImagenMicro] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createLine({ nombre_linea: nombreLinea, color_linea: colorLinea, imagen_micro: imagenMicro || null })
    setMessage(res.message)
    if (res.success) navigate('/lineas')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Nueva linea</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1' placeholder='Nombre linea' value={nombreLinea} onChange={(e) => setNombreLinea(e.target.value)} required />
        <input className='rounded border px-2 py-1' placeholder='Imagen micro' value={imagenMicro} onChange={(e) => setImagenMicro(e.target.value)} />
        <input className='h-9 rounded border px-2 py-1' type='color' value={colorLinea} onChange={(e) => setColorLinea(e.target.value)} />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
