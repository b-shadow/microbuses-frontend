import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getLine, updateLine } from '../services/module.service'

export function LinesEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [nombreLinea, setNombreLinea] = useState('')
  const [colorLinea, setColorLinea] = useState('#0284C7')
  const [imagenMicro, setImagenMicro] = useState('')
  const [active, setActive] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getLine(id)
      if (!res.success) {
        setMessage(res.message)
        return
      }
      setNombreLinea(res.data.nombre_linea ?? '')
      setColorLinea(res.data.color_linea ?? '#0284C7')
      setImagenMicro(res.data.imagen_micro ?? '')
      setActive(res.data.is_active)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await updateLine(id, {
      nombre_linea: nombreLinea,
      color_linea: colorLinea,
      imagen_micro: imagenMicro || null,
      is_active: active,
    })
    setMessage(res.message)
    if (res.success) navigate('/lineas')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Editar linea</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1' placeholder='Nombre linea' value={nombreLinea} onChange={(e) => setNombreLinea(e.target.value)} required />
        <input className='rounded border px-2 py-1' placeholder='Imagen micro' value={imagenMicro} onChange={(e) => setImagenMicro(e.target.value)} />
        <input className='h-9 rounded border px-2 py-1' type='color' value={colorLinea} onChange={(e) => setColorLinea(e.target.value)} />
        <label className='text-sm'>
          <input type='checkbox' className='mr-2' checked={active} onChange={(e) => setActive(e.target.checked)} />Activa
        </label>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Actualizar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
